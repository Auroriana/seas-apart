import { getFirestore } from "firebase-admin/firestore";
import { HttpsError } from "firebase-functions/v2/https";

// Every pairing attempt counts, right or wrong, so guessing codes is slow.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

interface RateDoc {
  windowStart: number;
  attempts: number;
}

const rateRef = (uid: string) => getFirestore().doc(`rateLimits/${uid}`);

export async function consumePairAttempt(uid: string): Promise<void> {
  const db = getFirestore();
  const ref = rateRef(uid);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const now = Date.now();
    const data = snap.exists ? (snap.data() as RateDoc) : null;

    if (!data || now - data.windowStart >= WINDOW_MS) {
      tx.set(ref, { windowStart: now, attempts: 1 } satisfies RateDoc);
      return;
    }
    if (data.attempts >= MAX_ATTEMPTS) {
      const minutes = Math.max(1, Math.ceil((data.windowStart + WINDOW_MS - now) / 60000));
      throw new HttpsError("resource-exhausted", `Too many attempts. Try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`);
    }
    tx.update(ref, { attempts: data.attempts + 1 });
  });
}

export async function clearPairAttempts(uid: string): Promise<void> {
  await rateRef(uid).delete();
}
