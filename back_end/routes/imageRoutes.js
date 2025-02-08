const express = require('express');
const { imageStore } = require('../services/firebase'); 
const router = express.Router();

// Upload image and store URL in Firestore
router.post('/upload-image', async (req, res) => {
  const { userUID, imageLink } = req.body;

  if (!userUID || !imageLink) {
    return res.status(400).json({ success: false, message: 'Missing userUID or imageLink' });
  }

  try {
    await imageStore(userUID, imageLink); // Store the image link in Firestore
    res.status(200).json({ success: true, message: 'Image stored successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to store image', error: error.message });
  }
});

module.exports = router;
