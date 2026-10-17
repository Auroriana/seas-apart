import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import type { Couple, UserProfile } from "../profile/types";

interface CoupleState {
  couple: Couple | null;
  partner: UserProfile | null;
}

export function useCouple(coupleId: string, myUid: string): CoupleState {
  const [couple, setCouple] = useState<Couple | null>(null);
  const [partner, setPartner] = useState<UserProfile | null>(null);

  useEffect(
    () =>
      onSnapshot(
        doc(db, "couples", coupleId),
        (snap) => setCouple(snap.exists() ? (snap.data() as Couple) : null),
        (err) => console.error(err),
      ),
    [coupleId],
  );

  const partnerUid = couple?.memberIds.find((id) => id !== myUid);
  useEffect(() => {
    if (!partnerUid) return;
    let cancelled = false;
    getDoc(doc(db, "users", partnerUid))
      .then((snap) => {
        if (!cancelled && snap.exists()) setPartner(snap.data() as UserProfile);
      })
      .catch((err: unknown) => console.error(err));
    return () => {
      cancelled = true;
    };
  }, [partnerUid]);

  return { couple, partner };
}
