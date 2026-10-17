import type { FirebaseApp } from "firebase/app";
import { CustomProvider, ReCaptchaV3Provider, initializeAppCheck } from "firebase/app-check";
import { FirebaseAppCheck } from "@capacitor-firebase/app-check";
import { isNative } from "./platform";

const FALLBACK_TOKEN_LIFETIME_MS = 55 * 60 * 1000;

let nativeReady: Promise<void> | null = null;

/** Starts the native App Check provider once. Play Integrity by default; debug provider if the env flag is set. */
function ensureNativeAppCheck(): Promise<void> {
  nativeReady ??= FirebaseAppCheck.initialize({
    debugToken: import.meta.env.VITE_APPCHECK_NATIVE_DEBUG === "true",
    isTokenAutoRefreshEnabled: true,
  });
  return nativeReady;
}

/**
 * Android: the native plugin does the attestation, and the web SDK (which Firestore and Functions use)
 * asks it for tokens through a custom provider.
 * Browser: reCAPTCHA v3, for local testing only.
 */
export function initAppCheck(app: FirebaseApp): void {
  if (isNative()) {
    initializeAppCheck(app, {
      provider: new CustomProvider({
        getToken: async () => {
          await ensureNativeAppCheck();
          const result = await FirebaseAppCheck.getToken({ forceRefresh: false });
          return {
            token: result.token,
            expireTimeMillis: result.expireTimeMillis ?? Date.now() + FALLBACK_TOKEN_LIFETIME_MS,
          };
        },
      }),
      isTokenAutoRefreshEnabled: true,
    });
    return;
  }

  const siteKey = import.meta.env.VITE_APPCHECK_WEB_SITE_KEY;
  if (!siteKey) {
    console.warn("App Check is off in the browser: VITE_APPCHECK_WEB_SITE_KEY is not set.");
    return;
  }
  if (import.meta.env.VITE_APPCHECK_WEB_DEBUG === "true") {
    (self as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string }).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
  initializeAppCheck(app, { provider: new ReCaptchaV3Provider(siteKey), isTokenAutoRefreshEnabled: true });
}
