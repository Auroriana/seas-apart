import { FirebaseError } from "firebase/app";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../lib/firebase";

const pairCoupleFn = httpsCallable<{ code: string }, { coupleId: string }>(functions, "pairCouple");
const unpairCoupleFn = httpsCallable<Record<string, never>, { ok: true }>(functions, "unpairCouple");

// Codes whose messages are written by our own functions and are safe to show.
const SHOWN_AS_IS = new Set([
  "functions/invalid-argument",
  "functions/not-found",
  "functions/failed-precondition",
  "functions/resource-exhausted",
]);

export function describeCallableError(err: unknown): string {
  if (err instanceof FirebaseError && SHOWN_AS_IS.has(err.code)) return err.message;
  if (err instanceof FirebaseError && err.code === "functions/unauthenticated") {
    return "This device could not be verified. Sign out, sign in again, and retry.";
  }
  return "Something went wrong. Try again in a moment.";
}

export async function pairWithCode(code: string): Promise<string> {
  const result = await pairCoupleFn({ code });
  return result.data.coupleId;
}

export async function unpair(): Promise<void> {
  await unpairCoupleFn({});
}
