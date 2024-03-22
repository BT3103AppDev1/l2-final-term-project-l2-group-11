import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyC-kRTd_iunubeNfVZSk0dvBov-NqxYKWw",
    authDomain: "bt3103-cpp-87b1e.firebaseapp.com",
    projectId: "bt3103-cpp-87b1e",
    storageBucket: "bt3103-cpp-87b1e.appspot.com",
    messagingSenderId: "213750455436",
    appId: "1:213750455436:web:fd3a9f7863981de01cafa9",
    measurementId: "G-BLGP01226W"
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;