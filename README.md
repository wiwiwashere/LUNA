# WiNGHacks 2025

# LUNA

**LUNA** is an innovative mobile application designed to help users better understand the ingredients in their food products. With a focus on women's health—addressing needs during pregnancy, PCOS, menopause, hormonal health, breastfeeding, and more—the app also supports various dietary restrictions (halal, kosher, keto, vegan) and allergy concerns.

## Features

- **Personalized Onboarding:**  
  On first launch, users answer questions about their health conditions, dietary restrictions, and allergies. This data is securely stored to provide tailored ingredient analysis.

- **Image-Based Food/Product Identification:**  
  Users can upload or capture images of food labels. The app leverages the Google Vision API to extract text and ingredient lists from these images.

- **Ingredient Analysis:**  
  Using AI services (such as OpenAI or Gemini), the extracted ingredient information is analyzed in the context of the user’s health profile and dietary preferences. The app then provides clear, actionable insights (for example, highlighting ingredients to avoid during pregnancy or for a keto diet).

- **User Feedback & History Tracking:**  
  Users can provide feedback on scan accuracy and review a history of their scanned products. This continuous feedback loop helps improve future recommendations and ingredient analyses.

## Target Users
- Pregnant Women: Need to avoid certain ingredients (e.g., unpasteurized dairy, high-mercury fish).
- Women with PCOS: May need to avoid processed sugars and focus on low-glycemic foods.
- Menopausal Women: May need to avoid foods that trigger hot flashes or focus on calcium-rich foods.
- Breastfeeding Mothers: Need to ensure they’re consuming enough nutrients and avoiding allergens that could affect the baby.
- Users with Allergies: Need to avoid specific allergens (e.g., nuts, gluten).
- Users with Dietary Restrictions: Halal, kosher, vegan, keto, etc.

## Technical Stack

- **Frontend:**  
  - Built with **React Native** for ios mobile development.
  
- **Backend:**  
  - **Node.js** with **Express.js** for handling API requests and integrating external services.
  - **Firebase Authentication** for secure user management.
  - **Firebase Firestore** for storing user preferences, scan histories, and other application data.

- **External APIs:**  
  - **Google Vision API:** Processes uploaded images to extract text from food labels.
  - **OpenAI/Gemini:** Provides AI-driven analysis to match ingredients with personalized dietary needs.

## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/wiwiwashere/pending.git
   cd pending
