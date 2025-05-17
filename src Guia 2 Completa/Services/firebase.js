// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpAztIyPu976wvu6f4vWAs2TjlY0Q-5_k",
  authDomain: "ecofood-app-542a8.firebaseapp.com",
  projectId: "ecofood-app-542a8",
  storageBucket: "ecofood-app-542a8.firebasestorage.app",
  messagingSenderId: "528873044813",
  appId: "1:528873044813:web:db1c5b99f747eaffd2d504",
  measurementId: "G-V6SDFSH50C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);