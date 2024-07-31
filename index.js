// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, get } from "firebase/database";

// Import other files
import { barcodeAndFirebase } from "./barcodeAndFirebase";
import { qrCode } from "./qrCode";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATrBJXCJQsBQ8WT-E4a8PmMfEtHj5kHb8",
  authDomain: "barcode-generator-80945.firebaseapp.com",
  projectId: "barcode-generator-80945",
  storageBucket: "barcode-generator-80945.appspot.com",
  messagingSenderId: "592941838858",
  appId: "1:592941838858:web:fdda79896dde0e0efde5f3",
  databaseURL: "https://barcode-generator-80945-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Call functions from barcodeAndFirebase.js and qrCode.js if needed
barcodeAndFirebase(database, ref, get, set, child);
qrCode();
