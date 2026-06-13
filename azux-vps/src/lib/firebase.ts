import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdScAcrntLhvOtucgKEJIL2UrAbmxB8to",
  authDomain: "wms-3pl-app.firebaseapp.com",
  projectId: "wms-3pl-app",
  storageBucket: "wms-3pl-app.firebasestorage.app",
  messagingSenderId: "190338039401",
  appId: "1:190338039401:web:6f2b6003ddff8d642dacf8",
  measurementId: "G-XXXXXXXXXX",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Analytics (optional, only in browser)
let analytics: ReturnType<typeof getAnalytics> | undefined;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
export { analytics };

// Re-export types for convenience
export type { User } from "firebase/auth";
export type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";