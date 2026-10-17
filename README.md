# Seas apart — Phase 1 (setup, sign-in, pairing)

## What is here
- `src/` React + TS app. Features live in `src/features/{auth,profile,pairing}`.
- `functions/` Cloud Functions: `ensureUserProfile`, `pairCouple`, `unpairCouple`.
- `firestore.rules` security rules. `firebase.json`, `.firebaserc`, `firestore.indexes.json` Firebase CLI config.
- `capacitor.config.ts` Android wrapper config (`appId: com.seasapart.app`).

## Tools to install once
- Node 22 (`node -v`), JDK 21, Android Studio (with an Android SDK and a phone or emulator).
- Firebase CLI: `npm install -g firebase-tools` (the command-line tool that deploys rules and functions), then `firebase login`.

## 1. Firebase console (console.firebase.google.com)
1. Create a project. Upgrade it to the Blaze plan (pay as you go): Cloud Functions will not deploy on the free plan. Two users stay far inside the free quotas; add a budget alert anyway.
2. Build > Authentication > Get started > Sign-in method > enable **Google**.
3. Build > Firestore Database > Create database > production mode > location `asia-southeast1`. The location cannot be changed later.
4. Project settings > Your apps > add a **Web app**. Copy its config into `src/config/firebaseConfig.ts`.
5. In `.firebaserc` and the config file, replace `YOUR_PROJECT_ID` with your real project ID.

## 2. Install, build, deploy backend
```bash
npm install                      # installs the app's dependencies
npm --prefix functions install   # installs the functions' dependencies
firebase deploy --only firestore:rules,functions
```
The deploy command uploads `firestore.rules` and compiles then uploads the three functions to `asia-southeast1`. The first deploy asks to enable some Google APIs; answer yes.

## 3. Android
```bash
npm run build            # builds the web app into dist/
npx cap add android      # generates the android/ folder (one time)
```
Then:
1. In `android/variables.gradle`, add inside `ext { ... }`: `rgcfaIncludeGoogle = true`
   (turns on native Google sign-in in the Firebase Authentication plugin).
2. Get your debug signing fingerprints: `cd android && ./gradlew signingReport`. Copy the SHA-1 and SHA-256 of the `debug` variant.
3. Firebase console > Project settings > add an **Android app** with package name `com.seasapart.app` and both fingerprints.
4. Download `google-services.json` **after** adding the fingerprints and put it in `android/app/`. Capacitor's template applies the Google Services Gradle plugin automatically when this file exists.
5. `npx cap sync android` then `npx cap open android`, and press Run in Android Studio. Do this on both phones (or build once and share the APK: Build > Build APK(s)).

Your partner's phone must install an APK signed with a key whose SHA-1 is registered. Simplest: build one debug APK and install that same file on both phones.

## 4. App Check
1. Firebase console > App Check > register your Android app with **Play Integrity**. Link the project in Play Console if asked.
2. Leave enforcement for Cloud Functions on (`ENFORCE_APP_CHECK=true` in `functions/.env`, already the default).
3. Sideloaded builds may fail Play Integrity (it expects Play-installed apps). If the app says "This device could not be verified":
   - set `VITE_APPCHECK_NATIVE_DEBUG=true` in `.env.local`, rebuild and sync,
   - run the app with the phone on USB and `adb logcat | grep DebugAppCheckProvider` to read the debug secret,
   - register it: App Check > your app > Manage debug tokens. Repeat for the partner's phone.
   Alternative: distribute through a private Play Console internal-testing track, where Play Integrity works.

## 5. Test with two Google accounts
1. Install on phone A, sign in with account A. You land on the pairing screen with an 8-character code.
2. Install on phone B (or an emulator), sign in with account B. Note its code.
3. On A, enter B's code, tap **Pair up**. Both phones should switch to "You're paired" (B updates live).
4. Check in Firestore console: one `couples/{id}` with both uids in `memberIds` and `status: "active"`; both `users` docs have that `coupleId`.
5. Failure checks: enter a made-up code (not-found message); enter your own code (rejected); a third account entering A's code (rejected as already paired); five wrong codes in a row (rate-limited for about 15 minutes).
6. Tap **Unpair** on either phone. Both return to the pairing screen; `couples/{id}.status` is `unpaired` and the doc still exists.
7. Rules check: in the Firestore console Rules playground, a read of `/users/{partnerUid}` is allowed for a paired member and denied for a stranger, and any write to `/users/*` is denied.

## Browser testing (optional)
`npm run dev`. App Check needs a reCAPTCHA v3 key (`VITE_APPCHECK_WEB_SITE_KEY`) and a registered debug token, or set `ENFORCE_APP_CHECK=false` in `functions/.env` and redeploy while testing. Set it back to `true` afterwards.
