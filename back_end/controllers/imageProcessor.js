const express = require('express');
const router = express.Router();
const { getVisionData } = require('../services/googleVision');
const { generateFeedback } = require('../services/openai');
const { authenticateUser } = require('../middleware/authMiddleware');

// Process uploaded image
router.post('/process-image', authenticateUser, async (req, res) => {
  const imageBuffer = req.files.image.data;
  try {
    // Use req.userId from the authenticated user
    const userId = req.userId;

    // Process the image using Google Vision API
    const textFromImage = await getVisionData(imgurLink);  // imgurLink should be set based on your image upload logic
    
    // Get user preferences from Firestore
    const userPreferences = await getUserPreferences(userId);

    // Send text and preferences to OpenAI for feedback
    const feedback = await generateFeedback(textFromImage, userPreferences);

    res.status(200).json({ feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
