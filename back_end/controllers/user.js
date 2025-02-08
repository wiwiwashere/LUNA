// update user preferences
const express = require('express');
const router = express.Router();
const { admin } = require('../services/firebase');

// Update user preferences
router.put('/preferences', async (req, res) => {
  const userId = req.userId; // Get the userId from the authenticated session
  const { allergies, dietaryRestrictions } = req.body;

  try {
    const userRef = admin.firestore().collection('users').doc(userId);
    await userRef.update({
      allergies,
      dietaryRestrictions,
      healthConditions,
    });
    res.status(200).json({ message: 'Preferences updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
