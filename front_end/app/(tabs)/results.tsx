import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, SafeAreaView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import ButtonComponent from '@/components/Button';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function ResultsScreen() {
  const { result } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    console.log("Raw result:", result);
    if (result) {
      try {
        const parsed = JSON.parse(result as string);
        console.log("Parsed result:", parsed);
      } catch (e) {
        console.error("Parsing error:", e);
      }
    }
  }, [result]);

  let parsedResult = null;
  try {
    parsedResult = result ? JSON.parse(result as string) : null;
  } catch (e) {
    console.error("Error parsing result:", e);
  }

  const renderAnalysis = () => {
    if (!parsedResult) {
      console.log("No parsed result available");
      return null;
    }

    console.log("Rendering analysis with:", parsedResult);

    return (
      <ThemedView style={styles.analysisContainer}>
        <ThemedText style={styles.sectionTitle}>Ingredients Found:</ThemedText>
        {Array.isArray(parsedResult.ingredients) ? (
          parsedResult.ingredients.map((ingredient: string, index: number) => (
            <ThemedText key={index} style={styles.ingredient}>• {ingredient}</ThemedText>
          ))
        ) : (
          <ThemedText style={styles.errorText}>No ingredients data available</ThemedText>
        )}

        <ThemedText style={styles.sectionTitle}>Analysis:</ThemedText>
        <ThemedText style={styles.analysisText}>
          {parsedResult.analysis || "No analysis available"}
        </ThemedText>
      </ThemedView>
    );
  };

  return (
    <ImageBackground
      source={require('@/assets/images/background.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.background}>
        <ScrollView contentContainerStyle={styles.container}>
          <ThemedView style={styles.contentContainer}>
            <ThemedText style={styles.title} type="title">Results</ThemedText>
            
            {parsedResult ? (
              renderAnalysis()
            ) : (
              <View>
                <ThemedText style={styles.errorText}>No result found.</ThemedText>
                <ThemedText style={styles.debugText}>Raw data: {result}</ThemedText>
              </View>
            )}

            <ButtonComponent 
              onPress={() => router.push("/")} 
              title="Scan Another Item" 
              style={styles.button}
              textStyle={styles.buttonText}
            />
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