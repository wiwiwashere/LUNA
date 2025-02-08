// functions/services/googleVision.js
const axios = require('axios');

const getVisionData = async (imageUrl) => {
  const response = await axios.post(
    'https://vision.googleapis.com/v1/images:annotate',
    {
      requests: [
        {
          image: { source: { imageUri: imageUrl } },
          features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GOOGLE_VISION_API_KEY}`,
      },
    }
  );
  return response.data.responses[0].fullTextAnnotation.text;
};

module.exports = { getVisionData };
