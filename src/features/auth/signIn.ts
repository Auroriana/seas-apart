import { GoogleAuthProvider, signInWithCredential, signInWithPopup, signOut } from "firebase/auth";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { auth } from "../../lib/firebase";
import { isNative } from "../../lib/platform";

/** Android: native Google account picker, then hand the credential to the web SDK. Browser: popup. */
export async function signInWithGoogle(): Promise<void> {
  if (isNative()) {
    const result = await FirebaseAuthentication.signInWithGoogle();
    const idToken = result.credential?.idToken;
    if (!idToken) throw new Error("Google did not return an ID token.");
    await signInWithCredential(auth, GoogleAuthProvider.credential(idToken, result.credential?.accessToken));
    return;
  }
  await signInWithPopup(auth, new GoogleAuthProvider());
}

export async function signOutEverywhere(): Promise<void> {
  await signOut(auth);
  if (isNative()) await FirebaseAuthentication.signOut();
}
