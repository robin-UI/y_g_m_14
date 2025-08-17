// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCKdRUvawhdKLYB5nm1VxO4z5b66pF-Wko",
  authDomain: "yougotamentor.firebaseapp.com",
  projectId: "yougotamentor",
  storageBucket: "yougotamentor.firebasestorage.app",
  messagingSenderId: "1096055753287",
  appId: "1:1096055753287:web:a817a004896c32ddbb3f62",
  measurementId: "G-EZGLFBGLYX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Analytics (optional, only if you need it)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;