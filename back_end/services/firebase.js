const admin = require('firebase-admin');
const dotenv = require('dotenv');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');
const { getAuth } = require('firebase/auth');
//const fileUpload = require('express-fileUpload');
const express = require('express');

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

const app2 = express();


// exports.storeImageLink = functions.https.onRequest(async (req, res) => {
//   if (req.method !== "POST") {
//     return res.status(405).send("Method Not Allowed");
//   }

//   try {
//     const { imageLink } = req.body;

//     if (!imageLink) {
//       return res.status(400).send("Missing userId or imageLink.");
//     }

//     const userRef = admin.firestore().collection('users').doc(userId);
//     const imageRef = userRef.collection('images');

//     await imageRef.add({
//       imageLink,
//       timestamp: admin.firestore.FieldValue.serverTimestamp(),
//     });

//     console.log("Image URL saved to Firestore.");
//     return res.status(200).send({ success: true, message: "Image saved successfully!" });

//   } catch (error) {
//     console.error("Error saving image URL:", error);
//     return res.status(500).send("Error saving image link to Firestore.");
//   }
// });

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
