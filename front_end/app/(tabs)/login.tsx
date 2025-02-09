import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db } from '../../../back_end/services/firebase.js'; // Make sure this path is correct
import { useNavigation } from "@react-navigation/native"; // To navigate after login
import { useRouter } from 'expo-router';

export default function LogInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state
  const router = useRouter();

  const navigation = useNavigation(); // For navigation after login

  // Handle the login functionality
  // const handleLogin = async () => {
  //   if (!email || !password) {
  //     Alert.alert("Error", "Please enter both email and password");
  //     return;
  //   }

  //   setLoading(true); // Show loading state

  //   try {
  //     await signInWithEmailAndPassword(auth, email, password);
  //     setLoading(false); // Hide loading state
  //     router.push('/(tabs)/camera');
  //   } catch (error: any) {
  //     setLoading(false); // Hide loading state
  //     Alert.alert("Login Failed", error.message); // Show error message
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#999"
        keyboardType="email-address"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#999"
      />

      {/* Login Button */}
      <TouchableOpacity
        style={styles.button}
        //onPress={handleLogin}
        disabled={loading} // Disable button while loading
      >
        <Text style={styles.buttonText}>{loading ? "Logging In..." : "Log In"}</Text>
      </TouchableOpacity>

      {/* Sign Up Button (optional) */}
      <TouchableOpacity onPress={() => router.push('/(tabs)/signup')}>
        <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
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
  signupText: {
    marginTop: 20,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
});
