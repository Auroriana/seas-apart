import { initializeApp } from "firebase-admin/app";

initializeApp();

export { ensureUserProfile } from "./ensureUserProfile";
export { pairCouple } from "./pairCouple";
export { unpairCouple } from "./unpairCouple";
