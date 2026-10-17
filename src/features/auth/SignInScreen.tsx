import { useState } from "react";
import { Button } from "../../components/Button";
import { ErrorNotice } from "../../components/ErrorNotice";
import { Screen } from "../../components/Screen";
import { signInWithGoogle } from "./signIn";

export function SignInScreen() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      setError("Google sign-in did not finish. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <div className="mt-[18vh] flex flex-col gap-3">
        <h1 className="font-display text-5xl leading-tight">Seas apart</h1>
        <p className="max-w-xs text-lg leading-relaxed text-sand-dim">A small shared place for the two of you.</p>
      </div>
      <div className="mt-auto flex flex-col gap-4">
        {error && <ErrorNotice message={error} />}
        <Button onClick={handleSignIn} disabled={busy}>
          {busy ? "Signing in…" : "Sign in with Google"}
        </Button>
      </div>
    </Screen>
  );
}
