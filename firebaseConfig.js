// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // 追加

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD6KV0qJzSqqtBMYbaMeSy7wTwSGsEiiTs",
    authDomain: "ec-site-da13b.firebaseapp.com",
    projectId: "ec-site-da13b",
    storageBucket: "ec-site-da13b.appspot.com",
    messagingSenderId: "898771380051",
    appId: "1:898771380051:web:00fbaa73d886964a7ce3a6",
    measurementId: "G-1HQEKEY1GG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // 追加
