import { View, TextInput, Alert, StyleSheet, ImageBackground, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { useRouter } from 'expo-router';
import ButtonComponent from '@/components/Button';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function LogInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();  

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch('http://10.136.1.40:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json(); // Parse response body as JSON
      console.log('Response body (JSON):', data); // Log the parsed data

      if (response.ok) {
        setLoading(false);
        //router.push("/(tabs)/profile/${data.user.uid}"); ///
        router.push({
          pathname: "/(tabs)/profile/",
          params: {
            token: data.user.uid
          }
       })
        // router.push({ pathname: '/(tabs)/profile/${data.user.uid}', params: data.user.uid }); // Remove the braces in params

        console.log('before'); 
        console.log('User is signed in:', data.user.uid);
        console.log('push to profile'); 
        // router.push('/(tabs)/explore'); 
      } else {
        setLoading(false);
        Alert.alert("Login Failed", data.error || "An error occurred");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Login Failed", (error as any).message);
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/background.jpg')} // Background image matching the signup screen
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.background}>
        <ThemedView style={styles.container}>
          <ThemedText style={styles.title} type="title">Log In</ThemedText>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#888"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#888"
          />

          <ButtonComponent onPress={handleLogin} title={loading ? "Logging In..." : "Log In"} style={styles.button} textStyle={styles.buttonText} />
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
  }
})