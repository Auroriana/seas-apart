import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.seasapart.app", // Change before first build if you want a different package name. Must match Firebase.
  appName: "Seas apart",
  webDir: "dist",
  plugins: {
    FirebaseAuthentication: {
      // The native plugin only fetches the Google credential. The web SDK signs in with it,
      // so Firestore, Functions and App Check all see the same signed-in user.
      skipNativeAuth: true,
      providers: ["google.com"],
    },
  },
};

export default config;
