// Replace every placeholder with the values from
// Firebase console > Project settings > Your apps > Web app > SDK setup and configuration.
// These values identify your project; they are not secrets. Access is controlled by security rules and App Check.
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
} as const;

// Region must match the one used in functions/src/config.ts.
export const FUNCTIONS_REGION = "asia-southeast1";
