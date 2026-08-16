import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCc0XUmLl0E4EPXIHPOvezS6PCISm_UHzk",
  authDomain: "annaverse-9a310.firebaseapp.com",
  projectId: "annaverse-9a310",
  storageBucket: "annaverse-9a310.firebasestorage.app",
  messagingSenderId: "736669287712",
  appId: "1:736669287712:web:d5627307c3e0ecff558345",
  databaseURL: "https://annaverse-9a310-default-rtdb.firebaseio.com"
};

// Initialize Firebase (SSR safe to prevent duplicate initialization during hot reloads or SSR builds)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const database = getDatabase(app);
export const auth = getAuth(app);
