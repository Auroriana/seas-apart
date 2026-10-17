import { useState } from "react";
import { Button } from "../../components/Button";
import { ErrorNotice } from "../../components/ErrorNotice";
import { Screen } from "../../components/Screen";
import { signOutEverywhere } from "../auth/signIn";
import type { UserProfile } from "../profile/types";
import { describeCallableError, unpair } from "./pairingApi";
import { useCouple } from "./useCouple";

interface Props {
  uid: string;
  profile: UserProfile & { coupleId: string };
}

// Phase 1 placeholder. Later phases replace this with the real home screen.
export function PairedHome({ uid, profile }: Props) {
  const { partner } = useCouple(profile.coupleId, uid);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUnpair() {
    setBusy(true);
    setError(null);
    try {
      await unpair(); // The profile listener moves the app back to the pairing screen.
    } catch (err) {
      console.error(err);
      setError(describeCallableError(err));
      setBusy(false);
    }
  }

  return (
    <Screen>
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl">You're paired</h1>
        <p className="text-sand-dim">
          {partner ? `Connected with ${partner.displayName}.` : "Connected with your partner."} Shared features arrive in the next phases.
        </p>
      </header>

      <div className="mt-auto flex flex-col gap-3">
        {error && <ErrorNotice message={error} />}
        {confirming ? (
          <>
            <p className="text-sm text-sand-dim">
              Unpairing ends the link for both of you. Your shared data is kept, but you will not see it until you pair again.
            </p>
            <Button variant="danger" onClick={handleUnpair} disabled={busy}>
              {busy ? "Unpairing…" : "Yes, unpair"}
            </Button>
            <Button variant="quiet" onClick={() => setConfirming(false)} disabled={busy}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button variant="quiet" onClick={() => setConfirming(true)}>
              Unpair
            </Button>
            <Button variant="quiet" onClick={() => void signOutEverywhere()}>
              Sign out
            </Button>
          </>
        )}
      </div>
    </Screen>
  );
}
