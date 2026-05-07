// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-e-shop.firebaseapp.com",
  projectId: "mern-e-shop",
  storageBucket: "mern-e-shop.firebasestorage.app",
  messagingSenderId: "597818451731",
  appId: "1:597818451731:web:8c5b36768e734005b5b4e7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
