import { httpsCallable } from "firebase/functions";
import { functions } from "../../lib/firebase";

interface EnsureProfileRequest {
  timezone: string;
}

const ensureUserProfileFn = httpsCallable<EnsureProfileRequest, { created: boolean }>(functions, "ensureUserProfile");

/** Creates users/{uid} with a unique share code if missing, and keeps the saved timezone current. */
export async function ensureUserProfile(): Promise<void> {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  await ensureUserProfileFn({ timezone });
}
