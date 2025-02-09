import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import React, { useState } from "react";
// import { useRouter } from 'expo-router';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { collection, doc, setDoc } from 'firebase/firestore';
// import { auth, db } from '@/firebaseConfig';

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [healthConditions, setHealthConditions] = useState("");
  // const router = useRouter();

  const handleSignup = async () => {

    if (!email || !password || !username) {
      Alert.alert("Error", "Please enter all fields.");
      return;
    }

    try {
      // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // const user = userCredential.user;

      // // 🔥 Store user details in Firestore
      // await setDoc(doc(db, "users", user.uid), {
      //   email,
      //   uid: user.uid,
      // });
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, healthConditions }),
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

    //   Alert.alert("Success", "Account created!");
    //   // router.push('/(tabs)/login'); // Redirect to login
    // // } catch (error) {
    // //   Alert.alert("Error", error.message);
    // // }
    // } catch (error) {
    //   console.log("error, Failed to connect to the server");
    //   Alert.alert("Error", "Failed to connect to the server");
    // }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Username" 
        value={username} 
        onChangeText={setName} 
        placeholderTextColor="#999" 
      />
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
    backgroundColor: "white"
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
});

