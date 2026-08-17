import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getDatabase } from "firebase/database";

// config for AKEdu
const firebaseConfig = {
  apiKey: "AIzaSyCcksBLOMZZJCmezBF8PX0VKHyVYKzPXJ4",
  authDomain: "akedu-89ce6.firebaseapp.com",
  projectId: "akedu-89ce6",
  storageBucket: "akedu-89ce6.firebasestorage.app",
  messagingSenderId: "645191561620",
  appId: "1:645191561620:web:341686e0b7f5881a975f81",
  measurementId: "G-SYY1EQ1S82",
  databaseURL:
    "https://akedu-89ce6-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// setLogLevel("debug");
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app, "asia-southeast1");
const rtdb = getDatabase(app);
// const analytics = getAnalytics(app);
export { auth, db, functions, rtdb};
