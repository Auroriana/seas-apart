import { useCallback, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { ensureUserProfile } from "./profileApi";
import type { UserProfile } from "./types";

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useUserProfile(uid: string): ProfileState {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Step 1: make sure the profile document exists (server creates it).
  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setError(null);
    ensureUserProfile()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((err: unknown) => {
        console.error(err);
        if (!cancelled) setError("Could not set up your profile. Check your connection and try again.");
      });
    return () => {
      cancelled = true;
    };
  }, [uid, attempt]);

  // Step 2: listen to it, so pairing and unpairing show up immediately.
  useEffect(() => {
    if (!ready) return;
    return onSnapshot(
      doc(db, "users", uid),
      (snap) => setProfile(snap.exists() ? (snap.data() as UserProfile) : null),
      (err) => {
        console.error(err);
        setError("Could not load your profile.");
      },
    );
  }, [uid, ready]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { profile, loading: !error && (!ready || !profile), error, retry };
}
