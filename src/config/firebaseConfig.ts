// Replace every placeholder with the values from
// Firebase console > Project settings > Your apps > Web app > SDK setup and configuration.
// These values identify your project; they are not secrets. Access is controlled by security rules and App Check.
export const firebaseConfig = {
  apiKey: "AIzaSyDxEgrANR-Ccbz58hx3JzhLX-rcp2Soe2I",
  authDomain: "ataraxia-77692.firebaseapp.com",
  projectId: "ataraxia-77692",
  storageBucket: "ataraxia-77692.firebasestorage.app",
  messagingSenderId: "131850691296",
  appId: "1:131850691296:web:7011937e05e3fe834e6685",
} as const;



// Region must match the one used in functions/src/config.ts.
export const FUNCTIONS_REGION = "asia-southeast1";
