const admin = require('firebase-admin');
const dotenv = require('dotenv');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');
const { getAuth } = require('firebase/auth');

dotenv.config();

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

// Initialize Firebase client SDK for user management
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Firebase token verification function
const verifyToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;  // Returns decoded user information
  } catch (error) {
    throw new Error('Unauthorized: Invalid Firebase Token');
  }
};

//store image link
async function imageStore (imageLink) {
  try{
    //const db = getFirestore();
    const userRef = admin.firestore().collection('users').doc(userId);
    const imageRef = userRef.collection('images');
    await imageRef.add({
      imageLink, 
    })
    // await addDoc(collection(db, `users/${userUID}/images`), {
    //   imageLink, 
    //   timestamp: new Date(),
    // });
    console.log("image url saved");
  }
  catch (error){
    console.error ("error saving image", error);
  }
}

module.exports = { app, db, auth, verifyToken, imageStore };
