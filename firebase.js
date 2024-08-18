// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4uWZYg5CkC0jd7OkmXQakI1L_hTYV-UU",
  authDomain: "flashcardsaas-5409b.firebaseapp.com",
  projectId: "flashcardsaas-5409b",
  storageBucket: "flashcardsaas-5409b.appspot.com",
  messagingSenderId: "15082863842",
  appId: "1:15082863842:web:e3a8015ed5de4821cf32bb",
  measurementId: "G-XF4M5HRYKM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)

export { db }