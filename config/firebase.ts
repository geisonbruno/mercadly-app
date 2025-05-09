import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPuMPU4REE7lkoT46qI0zAUj5yUpivLvk",
  authDomain: "mercadly-app.firebaseapp.com",
  projectId: "mercadly-app",
  storageBucket: "mercadly-app.firebasestorage.app",
  messagingSenderId: "914144261822",
  appId: "1:914144261822:web:d8938556933698f5f7d0ef",
  measurementId: "G-5EQ84LGF5X",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
