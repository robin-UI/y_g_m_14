// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKdRUvawhdKLYB5nm1VxO4z5b66pF-Wko",
  authDomain: "yougotamentor.firebaseapp.com",
  projectId: "yougotamentor",
  storageBucket: "yougotamentor.firebasestorage.app",
  messagingSenderId: "1096055753287",
  appId: "1:1096055753287:web:a817a004896c32ddbb3f62",
  measurementId: "G-EZGLFBGLYX",
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  // const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
auth.useDeviceLanguage(); // Set the language to the user's device language

export { auth };

// import { initializeApp } from "firebase/app";
// import 'firebase/auth'

// const firebaseConfig = {
//   apiKey: "AIzaSyCKdRUvawhdKLYB5nm1VxO4z5b66pF-Wko",
//   authDomain: "yougotamentor.firebaseapp.com",
//   projectId: "yougotamentor",
//   storageBucket: "yougotamentor.firebasestorage.app",
//   messagingSenderId: "1096055753287",
//   appId: "1:1096055753287:web:a817a004896c32ddbb3f62",
//   measurementId: "G-EZGLFBGLYX",
// };

// const app = initializeApp(firebaseConfig);
// export {app}
