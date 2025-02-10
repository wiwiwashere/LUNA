import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, SafeAreaView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { generateFeedback } from '../../utils/gemini'; 
import ButtonComponent from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function ResultsScreen() {
  const router = useRouter();
  const { ingredients } = useLocalSearchParams();
  const [analysis, setAnalysis] = useState(""); // State to store AI response
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [parsedIngredients, setParsedIngredients] = useState([]); // State for parsed ingredients

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!ingredients) return;

      try {
        // Ensure ingredients are parsed correctly
        const parsed = Array.isArray(ingredients) ? ingredients : JSON.parse(ingredients);
        console.log("Parsed ingredients:", parsed);

        // Set parsed ingredients to state
        setParsedIngredients(parsed);

        if (parsed.length === 0) {
          setAnalysis("No ingredients found in the image.");
          setLoading(false);
          return;
        }

        setLoading(true);
        const feedback = await generateFeedback(parsed);
        console.log("AI Response:", feedback);

        setAnalysis(feedback);
      } catch (error) {
        console.error("Error fetching analysis:", error);
        setAnalysis("An error occurred while fetching the analysis.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [ingredients]);

  return (
    <ImageBackground source={require('@/assets/images/background.jpg')} style={styles.backgroundImage} resizeMode="cover">
      <SafeAreaView style={styles.background}>
        <ScrollView contentContainerStyle={styles.container}>
          <ThemedView style={styles.contentContainer}>
            <ThemedText style={styles.title} type="title">Results</ThemedText>

            <ThemedView style={styles.analysisContainer}>
              <ThemedText style={styles.sectionTitle}>Ingredients Found:</ThemedText>
              {parsedIngredients.length > 0 ? (
                parsedIngredients.map((ingredient, index) => (
                  <ThemedText key={index} style={styles.ingredient}>• {ingredient}</ThemedText>
                ))
              ) : (
                <ThemedText style={styles.errorText}>No ingredients found.</ThemedText>
              )}

              <ThemedText style={styles.sectionTitle}>Analysis:</ThemedText>
              {loading ? (
                <ThemedText style={styles.analysisText}>Analyzing ingredients...</ThemedText>
              ) : (
                <ThemedText style={styles.analysisText}>{analysis || "No analysis available"}</ThemedText>
              )}
            </ThemedView>

            <ButtonComponent onPress={() => router.push("/")} title="Scan Another Item" style={styles.button} textStyle={styles.buttonText} />
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  contentContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "#fff",
    fontFamily: "HennyPenny",
  },
  analysisContainer: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: "#003366",
    fontFamily: 'AbhayaLibre',
  },
  ingredient: {
    fontSize: 18,
    marginLeft: 10,
    marginBottom: 5,
    color: "#333",
    fontFamily: 'AbhayaLibre',
  },
  analysisText: {
    fontSize: 18,
    lineHeight: 24,
    marginLeft: 10,
    color: "#333",
    fontFamily: 'AbhayaLibre',
  },
  errorText: {
    fontSize: 18,
    color: "#FF0000",
    textAlign: "center",
    fontFamily: 'AbhayaLibre',
  },
  debugText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'AbhayaLibre',
  },
  button: {
    marginTop: 10,
    width: '100%',
    padding: 15,
    backgroundColor: '#F0EbE7',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 30,
    color: '#3E5368',
    textAlign: 'center',
    fontFamily: 'Aboreto',
  }
});
