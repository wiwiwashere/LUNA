import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyARLgOKruIGWL3LREEZaFRamklgu3E90WE" || 'lock_key',
    authDomain: "luna-d4ef6.firebaseapp.com",
    projectId: "luna-d4ef6",
    storageBucket: "luna-d4ef6.firebasestorage.app",
    messagingSenderId: "335660896806",
    appId: "1:335660896806:web:5e625bd036c24c017e4ce7",
    measurementId: "G-PPHPNEW0VM",
};

const app = initializeApp(firebaseConfig, { automaticDataCollectionEnabled: false });

const auth = getAuth(app);


export { auth, onAuthStateChanged };