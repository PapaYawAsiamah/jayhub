// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDpUm2RbeUetKF2-ZW_8wmHNJgMKeSejY",
  authDomain: "jayhub-3be30.firebaseapp.com",
  projectId: "jayhub-3be30",
  storageBucket: "jayhub-3be30.appspot.com",
  messagingSenderId: "415245826414",
  appId: "1:415245826414:web:3c2aec995b560fb28ae97f"
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)

// const ap = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {app, auth, db}
// Initialize Firebase
// const app = initializeApp(firebaseConfig);