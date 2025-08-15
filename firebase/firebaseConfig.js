// firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCurKQ-KmTmdcWB2TAIulKjrUTZyKMjSes",
  authDomain: "shezlong-7669c.firebaseapp.com",
  projectId: "shezlong-7669c",
  storageBucket: "shezlong-7669c.firebasestorage.app",
  messagingSenderId: "1069861402295",
  appId: "1:1069861402295:web:c317cd43e0b8c2da7c3f32",
  measurementId: "G-L1VCNVFM4C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;