import { defineBoolean } from "firebase-functions/params";
import type { CallableOptions } from "firebase-functions/v2/https";

// Must match FUNCTIONS_REGION in src/config/firebaseConfig.ts (the app). Singapore is closest to the Philippines.
export const REGION = "asia-southeast1";

// Read from functions/.env at deploy time.
export const ENFORCE_APP_CHECK = defineBoolean("ENFORCE_APP_CHECK", { default: true });

export const callableOptions: CallableOptions = {
  region: REGION,
  enforceAppCheck: ENFORCE_APP_CHECK,
  maxInstances: 5, // Two users never need more. Caps cost if something loops.
};
