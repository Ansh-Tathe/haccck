// ─────────────────────────────────────────────────────────────────────────────
// PANDA Firebase Configuration
//
// HOW TO FILL THIS IN:
// 1. Go to https://console.firebase.google.com
// 2. Create a project called "panda-attendance"
// 3. Click the </> (Web) icon to add a web app
// 4. Copy the firebaseConfig object values into the fields below
// 5. In the Firebase console, go to Firestore Database → Create Database
//    → Start in TEST MODE → choose any region → Done
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId: "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket: "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "PASTE_YOUR_APP_ID_HERE",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
