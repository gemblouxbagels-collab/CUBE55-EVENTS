import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "events-cube55",
  appId: "1:99023575114:web:436ba1cbd249aa067b6eb3",
  storageBucket: "events-cube55.firebasestorage.app",
  apiKey: "AIzaSyBymZz8j3BP_1mUd7ZMjoViO6XL6EBu8JQ",
  authDomain: "events-cube55.firebaseapp.com",
  messagingSenderId: "99023575114",
  measurementId: "G-XXXXXXXXXX"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
