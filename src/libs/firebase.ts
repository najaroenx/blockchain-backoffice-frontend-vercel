// src/libs/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  // connectFirestoreEmulator
} from "firebase/firestore";

const firebaseConfig = {
  // เอาค่าจาก Firebase Console มาใส่ตรงนี้
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// ป้องกันการ Init ซ้ำใน Next.js
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app, "dlt-db");

// -----------------------------------------------------------
// 🔥 ส่วนสำคัญ: ถ้ากำลังรัน Local (dev) ให้ต่อ Emulator แทน Cloud จริง
// -----------------------------------------------------------
// if (process.env.NODE_ENV === "development") {
//   console.log("🔥 Connecting to Firestore Emulator");
//   // Port 8080 คือ port มาตรฐานของ Firestore Emulator
// connectFirestoreEmulator(db, "localhost", 8080);
// }
// connectFirestoreEmulator(db, "localhost", 8080);
console.log("🔥 Connecting to Firestore Emulator");
export { db };
