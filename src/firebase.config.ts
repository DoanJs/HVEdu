import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getDatabase } from "firebase/database";

// config for HVEdu
const firebaseConfig = {
  apiKey: "AIzaSyAkFyg-gZ0262hDhGMP6NZnJTUwnpYNvUI",
  authDomain: "hvedu-de288.firebaseapp.com",
  databaseURL: "https://hvedu-de288-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hvedu-de288",
  storageBucket: "hvedu-de288.firebasestorage.app",
  messagingSenderId: "220767617656",
  appId: "1:220767617656:web:a445b9fd8f0448b74f638d",
  measurementId: "G-L0FSB73CY1"
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
