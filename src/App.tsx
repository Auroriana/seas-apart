import { Button } from "./components/Button";
import { ErrorNotice } from "./components/ErrorNotice";
import { Screen } from "./components/Screen";
import { Splash } from "./components/Splash";
import { SignInScreen } from "./features/auth/SignInScreen";
import { useAuth } from "./features/auth/useAuth";
import { PairedHome } from "./features/pairing/PairedHome";
import { PairingScreen } from "./features/pairing/PairingScreen";
import { useUserProfile } from "./features/profile/useUserProfile";

function SignedInApp({ uid }: { uid: string }) {
  const { profile, loading, error, retry } = useUserProfile(uid);

  if (error) {
    return (
      <Screen>
        <ErrorNotice message={error} />
        <Button onClick={retry}>Try again</Button>
      </Screen>
    );
  }
  if (loading || !profile) return <Splash />;
  if (profile.coupleId) return <PairedHome uid={uid} profile={{ ...profile, coupleId: profile.coupleId }} />;
  return <PairingScreen profile={profile} />;
}

export function App() {
  const { user, loading } = useAuth();
  if (loading) return <Splash />;
  if (!user) return <SignInScreen />;
  return <SignedInApp uid={user.uid} />;
}
