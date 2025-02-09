import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";

export default function LogInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // const handleLogin = async () => {
  //   try {
  //     // Simulating login process (Replace with Firebase login)
  //     if (email === "test@example.com" && password === "password123") {
  //       Alert.alert("Success", "Logged in successfully!");
  //       router.push("/(tabs)/profile"); // Redirect to Profile
  //     } else {
  //       Alert.alert("Error", "Invalid credentials.");
  //     }
  //   } catch (error) {
  //     Alert.alert("Error", "Failed to log in.");
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        placeholderTextColor="#999" 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
        placeholderTextColor="#999" 
      />
      {/* <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      {/* Navigation Links */}
      {/* <TouchableOpacity onPress={() => router.push('/(tabs)/signup')}>
        <Text style={styles.linkText}>Don't have an account? Create Account</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    color: "#333",  
    fontSize: 16,   
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  linkText: {
    marginTop: 15,
    fontSize: 16,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
});