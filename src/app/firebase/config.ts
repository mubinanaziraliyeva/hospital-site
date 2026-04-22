import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase konfiguratsiyasi
// Bu ma'lumotlarni Firebase Console dan olish kerak
// https://console.firebase.google.com/ ga kiring
// Project Settings -> General -> Your apps -> Web app -> Config
const firebaseConfig = {
  apiKey: "AIzaSyAzBgS0ah-PFxUTF-60QOVqLJgscn1zaPM",
  authDomain: "fast-hospital-9a19d.firebaseapp.com",
  projectId: "fast-hospital-9a19d",
  storageBucket: "fast-hospital-9a19d.firebasestorage.app",
  messagingSenderId: "84891373655",
  appId: "1:84891373655:web:bfeff15ffd0dc5c7685312",
};

// Firebase ni ishga tushirish
let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
  
  // Auth va Firestore xizmatlarini export qilish
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export { auth, db };
export default app;