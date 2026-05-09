// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "e-commerce-49eb6.firebaseapp.com",
  projectId: "e-commerce-49eb6",
  storageBucket: "e-commerce-49eb6.firebasestorage.app",
  messagingSenderId: "1080129893692",
  appId: "1:1080129893692:web:8f7b9b2cc4b5f0b2e91a39",
  measurementId: "G-31D58NEYZH"
};

// Initialize Firebase with a safety check
let app;
try {
  if (!firebaseConfig.apiKey) {
    console.warn('Firebase API Key is missing! Google Auth will not work.');
  }
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Firebase initialization failed:', error);
}

export { app };
