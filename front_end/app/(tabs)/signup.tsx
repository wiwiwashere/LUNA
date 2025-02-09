import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ImageBackground, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { useRouter } from 'expo-router';
import ButtonComponent from '@/components/Button';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [healthConditions, setHealthConditions] = useState("");
  const [allergies, setAllergies] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");

  const handleSignup = async () => {
    if (!email || !password || !username) {
      Alert.alert("Error", "Please enter all fields.");
      return;
    }

    try {
      const responseString = JSON.stringify({
        email,
        password,
        healthConditions,
        preferences: {
          allergies: allergies.split(",").map(item => item.trim()),
          dietaryRestrictions: dietaryRestrictions.split(",").map(item => item.trim()),
        }
       });
       console.log(responseString);
      const response = await fetch("http://10.136.1.40:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: responseString,
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        Alert.alert("Success", "User Registered Successfully!");
      } else {
        Alert.alert("Error", data.error);
      }
    } catch (error) {
      console.log("Failed to connect to the server", error);
      Alert.alert("Error", "Failed to connect to the server");
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/background.jpg')} // Background image
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.background}>
        <ThemedView style={styles.container}>
          <ThemedText style={styles.title} type="title">Sign Up</ThemedText>

          <TextInput 
            style={styles.input} 
            placeholder="Username" 
            value={username} 
            onChangeText={setName} 
            placeholderTextColor="#888" 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            value={email} 
            onChangeText={setEmail} 
            placeholderTextColor="#888" 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Password" 
            secureTextEntry 
            value={password} 
            onChangeText={setPassword} 
            placeholderTextColor="#888" 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Health Conditions (comma-separated)" 
            value={healthConditions} 
            onChangeText={setHealthConditions} 
            placeholderTextColor="#888" 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Allergies (comma-separated)" 
            value={allergies} 
            onChangeText={setAllergies} 
            placeholderTextColor="#888" 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Dietary Restrictions (comma-separated)" 
            value={dietaryRestrictions} 
            onChangeText={setDietaryRestrictions} 
            placeholderTextColor="#888" 
          />

          <ButtonComponent onPress={handleSignup} title="Register" style={styles.button} textStyle={styles.buttonText} />
        </ThemedView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
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
  input: {
    width: "100%",
    padding: 12,
    marginVertical: 10,
    borderWidth: 2,  
    borderRadius: 5,
    borderColor: "#003366", 
    color: "#333",  
    fontSize: 16,
    fontFamily: 'AbhayaLibre', 
    backgroundColor: "#fff", 
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
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});