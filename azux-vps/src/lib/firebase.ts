import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJYHc1F82v-IboPGFjGFn9xZ8Lt35YTkM",
  authDomain: "wms-3pl-79a05.firebaseapp.com",
  projectId: "wms-3pl-79a05",
  storageBucket: "wms-3pl-79a05.firebasestorage.app",
  messagingSenderId: "213756667050",
  appId: "1:213756667050:web:88e060d061075e1d6f5cd3",
  measurementId: "G-036287P2PB",
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