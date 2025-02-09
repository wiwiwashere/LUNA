import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";

export default function ResultsScreen() {
  const { result } = useLocalSearchParams();
  const router = useRouter();

  const parsedResult = result ? JSON.parse(result as string) : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Analysis Result</Text>
      {parsedResult ? (
        <Text style={styles.resultText}>{JSON.stringify(parsedResult, null, 2)}</Text>
      ) : (
        <Text style={styles.errorText}>No result found.</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={() => router.push("/")}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  resultText: { fontSize: 16, textAlign: "left", lineHeight: 22, marginBottom: 10 },
  errorText: { fontSize: 16, color: "red", marginBottom: 10 },
  button: { backgroundColor: "#007BFF", padding: 12, borderRadius: 5, alignItems: "center", marginTop: 20 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
