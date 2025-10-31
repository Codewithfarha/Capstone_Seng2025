// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDq5Z4sXZX2K13Czte7j6xUmlX6vFI-Vpo",
  authDomain: "library-finder-app.firebaseapp.com",
  projectId: "library-finder-app",
  storageBucket: "library-finder-app.firebasestorage.app",
  messagingSenderId: "1046047312839",
  appId: "1:1046047312839:web:9fa91a1baab116c11b27e2",
  measurementId: "G-HCCP0WZXND"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (optional)
export const analytics = getAnalytics(app);

export default app;