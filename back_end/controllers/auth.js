//store user data and preferences
const { firebase, admin } = require('../services/firebase');
const express = require('express');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, healthConditions } = req.body; // Expecting healthConditions in the request body
  try {
    // Register user with Firebase Auth
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Store user data (including health conditions) in Firestore
    await admin.firestore().collection('users').doc(user.uid).set({
      email: user.email,
      healthConditions: healthConditions || [],
      preferences: {
        allergies: [],
        dietaryRestrictions: [],
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Retrieve user preferences (including health conditions) from Firestore
    const userDoc = await admin.firestore().collection('users').doc(user.uid).get();
    const userData = userDoc.data();

    // Send the user info along with preferences and health conditions
    res.status(200).json({
      user,
      preferences: userData.preferences,
      healthConditions: userData.healthConditions,
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

module.exports = router;
