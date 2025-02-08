const { OpenAI } = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateFeedback = async (ingredients, preferences) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'user',
        content: `Based on the following ingredients: ${ingredients}, and the user's preferences: ${JSON.stringify(
          preferences
        )}, provide feedback on whether the ingredients are suitable or not for the user.`,
      },
    ],
  });

  return response.choices[0].message.content;
};

module.exports = { generateFeedback };
