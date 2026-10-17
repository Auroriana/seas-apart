import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { callableOptions } from "./config";
import { requireUid } from "./helpers";
import { clearPairAttempts, consumePairAttempt } from "./rateLimit";
import { normalizeShareCode } from "./shareCode";

export const pairCouple = onCall<{ code?: unknown }>(callableOptions, async (request) => {
  const uid = requireUid(request);

  const code = normalizeShareCode(request.data?.code);
  if (!code) throw new HttpsError("invalid-argument", "Enter the 8-character code.");

  await consumePairAttempt(uid);

  const db = getFirestore();
  const match = await db.collection("users").where("shareCode", "==", code).limit(1).get();
  const partnerDoc = match.docs[0];
  if (!partnerDoc) throw new HttpsError("not-found", "No one has that code. Check it and try again.");

  const partnerUid = partnerDoc.id;
  if (partnerUid === uid) throw new HttpsError("invalid-argument", "That is your own code. Enter your partner's.");

  const myRef = db.doc(`users/${uid}`);
  const partnerRef = db.doc(`users/${partnerUid}`);
  const coupleRef = db.collection("couples").doc();

  // One transaction: both users are re-checked and updated together, so no one ends up half-paired.
  await db.runTransaction(async (tx) => {
    const [mySnap, partnerSnap] = await tx.getAll(myRef, partnerRef);
    if (!mySnap?.exists) throw new HttpsError("failed-precondition", "Your profile is not ready. Reopen the app and try again.");
    if (!partnerSnap?.exists || partnerSnap.get("shareCode") !== code) {
      throw new HttpsError("not-found", "No one has that code. Check it and try again.");
    }
    if (mySnap.get("coupleId") != null) throw new HttpsError("failed-precondition", "You are already paired. Unpair first.");
    if (partnerSnap.get("coupleId") != null) throw new HttpsError("failed-precondition", "That person is already paired.");

    tx.create(coupleRef, {
      memberIds: [uid, partnerUid],
      status: "active",
      nextMeetupDate: null,
      createdAt: FieldValue.serverTimestamp(),
    });
    tx.update(myRef, { coupleId: coupleRef.id });
    tx.update(partnerRef, { coupleId: coupleRef.id });
  });

  await clearPairAttempts(uid);
  return { coupleId: coupleRef.id };
});
