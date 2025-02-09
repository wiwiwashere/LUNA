const { OpenAI } = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateFeedback = async (ingredients, userData) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'user',
        content: `Analyze these ingredients: ${ingredients.join(', ')}

            User Health Profile:
            - Health Conditions: ${userData.healthConditions.join(', ')}
            - Allergies: ${userData.allergies.join(', ')}
            - Dietary Restrictions: ${userData.dietaryRestrictions.join(', ')}

            Please provide:
            1. Whether these ingredients are safe based on their health conditions and allergies
            2. Whether these ingredients comply with their dietary restrictions
            3. Specific ingredients they should avoid
            4. Alternative ingredients or products they could try instead
        `,
      },
    ],
  });

  return response.choices[0].message.content;
};

module.exports = { generateFeedback };
