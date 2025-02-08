import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import React, { useState } from "react";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [healthConditions, setHealthConditions] = useState("");

  const handleSignup = async () => {
    try {
      const response = await fetch("http://127.0.01:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: 'http://127.0.0.1:5000'},
        body: JSON.stringify({ email, password, healthConditions }),
        mode: 'no-cors', // Added no-cors mode
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "User Registered Successfully!");
      } else {
        Alert.alert("Error", data.error);
      }
    } catch (error) {
      console.log("error, Failed to connect to the server");
      Alert.alert("Error", "Failed to connect to the server");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
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
      <TextInput 
        style={styles.input} 
        placeholder="Health Conditions (comma-separated)" 
        value={healthConditions} 
        onChangeText={setHealthConditions} 
        placeholderTextColor="#999" 
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Register</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
});

