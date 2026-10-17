import { Button } from "../../components/Button";
import { Screen } from "../../components/Screen";
import { signOutEverywhere } from "../auth/signIn";
import type { UserProfile } from "../profile/types";
import { PartnerCodeForm } from "./PartnerCodeForm";
import { ShareCodeCard } from "./ShareCodeCard";

export function PairingScreen({ profile }: { profile: UserProfile }) {
  return (
    <Screen>
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl">Pair with your partner</h1>
        <p className="text-sand-dim">Trade codes. Only one of you needs to enter the other's.</p>
      </header>
      <ShareCodeCard code={profile.shareCode} />
      <PartnerCodeForm />
      <Button variant="quiet" className="mt-auto" onClick={() => void signOutEverywhere()}>
        Sign out
      </Button>
    </Screen>
  );
}
