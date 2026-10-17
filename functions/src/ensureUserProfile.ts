import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { callableOptions } from "./config";
import { isValidTimezone, requireUid } from "./helpers";
import { generateShareCode } from "./shareCode";

const ALREADY_EXISTS = 6; // gRPC status code returned by Firestore create() when the document exists.
const MAX_CODE_TRIES = 5;

/**
 * Creates users/{uid} on first sign-in, with a unique share code, and keeps the timezone current afterwards.
 * Done here instead of in the app so a client can never choose its own shareCode or coupleId.
 */
export const ensureUserProfile = onCall<{ timezone?: unknown }>(callableOptions, async (request) => {
  const uid = requireUid(request);
  const timezone = request.data?.timezone;
  if (!isValidTimezone(timezone)) throw new HttpsError("invalid-argument", "Invalid timezone.");

  const db = getFirestore();
  const ref = db.doc(`users/${uid}`);

  const existing = await ref.get();
  if (existing.exists) {
    if (existing.get("timezone") !== timezone) await ref.update({ timezone });
    return { created: false };
  }

  const token = request.auth?.token;
  const email = token?.email ?? "";
  const displayName = token?.name ?? (email ? email.split("@")[0] : "") ?? "";

  for (let attempt = 0; attempt < MAX_CODE_TRIES; attempt++) {
    const shareCode = generateShareCode();
    const clash = await db.collection("users").where("shareCode", "==", shareCode).limit(1).get();
    if (!clash.empty) continue;
    try {
      // create() fails if the document already exists, which covers two sign-in calls racing each other.
      await ref.create({
        displayName: displayName || "Partner",
        email,
        coupleId: null,
        shareCode,
        timezone,
        createdAt: FieldValue.serverTimestamp(),
      });
      return { created: true };
    } catch (err) {
      if ((err as { code?: number }).code === ALREADY_EXISTS) return { created: false };
      throw err;
    }
  }
  throw new HttpsError("internal", "Could not generate a share code. Try again.");
});
