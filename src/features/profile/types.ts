import type { Timestamp } from "firebase/firestore";

export interface UserProfile {
  displayName: string;
  email: string;
  coupleId: string | null;
  shareCode: string;
  timezone: string;
  createdAt: Timestamp;
}

export interface Couple {
  memberIds: string[];
  status: "active" | "unpaired";
  nextMeetupDate: Timestamp | null;
  createdAt: Timestamp;
}
