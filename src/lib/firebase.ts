import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { FUNCTIONS_REGION, firebaseConfig } from "../config/firebaseConfig";
import { initAppCheck } from "./appCheck";

export const app = initializeApp(firebaseConfig);
initAppCheck(app); // Must run before Auth, Firestore or Functions make their first request.

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, FUNCTIONS_REGION);
