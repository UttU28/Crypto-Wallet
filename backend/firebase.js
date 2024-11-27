// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDMYxICXazT3yrEq1CcG4GijfLnXjnV5DM",
  authDomain: "digitalpaisa.firebaseapp.com",
  projectId: "digitalpaisa",
  storageBucket: "digitalpaisa.firebasestorage.app",
  messagingSenderId: "959175677727",
  appId: "1:959175677727:web:9584dccf894a753966c22a",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
