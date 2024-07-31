// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, get } from "firebase/database";

// Import other files
import { barcodeAndFirebase } from "./barcodeAndFirebase";
import { qrCode } from "./qrCode";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC4dUNYpFWX47HL84kHpEWt67yiJ97b5Cc",
    authDomain: "barcodegenerator-fb518.firebaseapp.com",
    projectId: "barcodegenerator-fb518",
    storageBucket: "barcodegenerator-fb518.appspot.com",
    messagingSenderId: "974105285506",
    appId: "1:974105285506:web:7751aca6814d4f2778359b",
    databaseURL: "https://barcodegenerator-fb518-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Call functions from barcodeAndFirebase.js and qrCode.js if needed
barcodeAndFirebase(database, ref, get, set, child);
qrCode();