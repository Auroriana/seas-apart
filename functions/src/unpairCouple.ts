import { getFirestore } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { callableOptions } from "./config";
import { requireUid } from "./helpers";

/** Ends the pairing for both people. The couple document and everything under it stay in place. */
export const unpairCouple = onCall(callableOptions, async (request) => {
  const uid = requireUid(request);
  const db = getFirestore();
  const myRef = db.doc(`users/${uid}`);

  await db.runTransaction(async (tx) => {
    const mySnap = await tx.get(myRef);
    const coupleId = mySnap.get("coupleId") as string | null | undefined;
    if (!coupleId) throw new HttpsError("failed-precondition", "You are not paired.");

    const coupleRef = db.doc(`couples/${coupleId}`);
    const coupleSnap = await tx.get(coupleRef);
    const memberIds = (coupleSnap.get("memberIds") as string[] | undefined) ?? [];

    // Stale link (couple missing, or this user is not a member): only clear this user's own pointer.
    if (!coupleSnap.exists || !memberIds.includes(uid)) {
      tx.update(myRef, { coupleId: null });
      return;
    }

    const memberSnaps = await tx.getAll(...memberIds.map((id) => db.doc(`users/${id}`)));

    tx.update(coupleRef, { status: "unpaired" });
    for (const snap of memberSnaps) {
      if (snap.exists && snap.get("coupleId") === coupleId) tx.update(snap.ref, { coupleId: null });
    }
  });

  return { ok: true as const };
});
