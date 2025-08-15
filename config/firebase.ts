
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth"; // usado no Web
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const app = initializeApp({
  apiKey: "AIzaSyDPuMPU4REE7lkoT46qI0zAUj5yUpivLvk",
  authDomain: "mercadly-app.firebaseapp.com",
  projectId: "mercadly-app",
  storageBucket: "mercadly-app.firebasestorage.app",
  messagingSenderId: "914144261822",
  appId: "1:914144261822:web:d8938556933698f5f7d0ef",
  measurementId: "G-5EQ84LGF5X",
});

export const db = getFirestore(app);

let authRef: Auth;

if (Platform.OS === "web") {
  authRef = getAuth(app);
} else {
  const req = (eval("require") as any);
  const rnAuth = req("firebase/auth/react-native");
  authRef = rnAuth.initializeAuth(app, {
    persistence: rnAuth.getReactNativePersistence(AsyncStorage),
  });
}

export const auth = authRef;
