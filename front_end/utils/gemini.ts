import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAZtf-TWKtOaC97xT4Ll5tR1qpcOMPUtBc"); 

export const generateFeedback = async (ingredients) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Analyze these ingredients for their suitability for women with pregnancy or hormonal issues: ${ingredients.join(", ")}.

      Please provide:
      1. Whether these ingredients are generally good or bad for women who are pregnant or dealing with hormonal issues.
      2. Any specific ingredients that might be beneficial or harmful.
      3. Suggestions for alternative ingredients or foods that could be better.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Error generating feedback.";
  }
};

