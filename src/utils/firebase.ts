import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDUdfmdBEY9nBcdHOaHWx6H-gxLtYz9mCo",
  authDomain: "panda-attendance.firebaseapp.com",
  projectId: "panda-attendance",
  storageBucket: "panda-attendance.firebasestorage.app",
  messagingSenderId: "551554843553",
  appId: "1:551554843553:web:5fd5ad36db8d8cb916c1e0",
  measurementId: "G-JZ5EMNGBKP"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
