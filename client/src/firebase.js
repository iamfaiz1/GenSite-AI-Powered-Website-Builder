// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "gensite-9f5d6.firebaseapp.com",
  projectId: "gensite-9f5d6",
  storageBucket: "gensite-9f5d6.firebasestorage.app",
  messagingSenderId: "174367167934",
  appId: "1:174367167934:web:251616ed58dee1a3ddd5ef",
  measurementId: "G-XBNYK8HGBR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };