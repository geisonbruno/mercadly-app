import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.GOOGLE_API_KEY,
  authDomain: "mercadly-app.firebaseapp.com",
  projectId: "mercadly-app",
  storageBucket: "mercadly-app.firebasestorage.app",
  messagingSenderId: "914144261822",
  appId: "1:914144261822:web:d8938556933698f5f7d0ef",
  measurementId: "G-5EQ84LGF5X",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
