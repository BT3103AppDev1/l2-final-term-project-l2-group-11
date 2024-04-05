import firebase from 'firebase/compat/app';

const firebaseConfig = {
    apiKey: "AIzaSyDb_FdJV3Fd0j02EEjy4m3Bu8PQXzhFrFY",
    authDomain: "kaizen-79eda.firebaseapp.com",
    projectId: "kaizen-79eda",
    storageBucket: "kaizen-79eda.appspot.com",
    messagingSenderId: "1049201502063",
    appId: "1:1049201502063:web:e2b002fd30730307a3aa9a"
};

firebase.initializeApp(firebaseConfig);

export default firebase;