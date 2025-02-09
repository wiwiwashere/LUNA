const express = require('express');
const app = express();
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');
const { auth, db } = require('../services/firebase');
const router = express.Router();

app.post('/register', async (req, res) => {
  const { email, username, password, healthConditions } = req.body;
  console.log('Email', email);
  console.log('HITTING REGISTER:::::::');
  
  try {
    // Register user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      username: user.username,
      healthConditions: healthConditions || [],
      allergies: user.allergies || [],
      dietaryRestrictions: user.dietaryRestrictions || [],
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Sign in user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    const userData = userDoc.data();

    res.status(200).json({
      message: "Login successful",
      user: {
        uid: user.uid,
        email: user.email,
      },
      allergies:userData.allergies,
      dietaryRestrictions: userData.dietaryRestrictions,
      healthConditions: userData.healthConditions,
      username: userData.username,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: "Invalid email or password" });
  }
});

module.exports = router;