<<<<<<< HEAD
import { View, Text, ImageBackground, Image, StyleSheet, Platform, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ButtonComponent from '@/components/Button';
import Camera from './camera';
import { Link, Tabs, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from "firebase/auth";
import * as SplashScreen from 'expo-splash-screen'

//import { db } from '../../../back_end/services/firebase.js';
//import { collection, getDocs } from 'firebase/firestore';

SplashScreen.preventAutoHideAsync();


export default function HomeScreen() {

  const navigation = useNavigation();
  // camera state
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // action for camera press
  const handleCameraPress = () => {
    // navigation.navigate('./(tabs)/camera');
    // setIsCameraVisible(prevState => !prevState); 
    router.push('/(tabs)/camera'); 
  };

  // action for upload button
  const handleUploadPress = () => {
    Alert.alert('upload pressed!'); 
  };

  // const { user } = useAuth();
=======
import { ImageBackground, SafeAreaView, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import ButtonComponent from '@/components/Button';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import axios from 'axios';

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
>>>>>>> 6bc2f2f81b376e85c00a355839975eeed3dd9d90

  // Handle image upload
  const handleUploadPress = async () => {
    try {
      // Request permissions to access the image gallery
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert("Permission Required", "You need to grant permission to access your photo library.");
        return;
      }

<<<<<<< HEAD
  const [appReady, setAppReady] = useState(false);
  const [showTabBar, setShowTabBar] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      await new Promise(resolve => setTimeout(resolve, 12000)); // ✅ Simulate loading (12 sec)
      setAppReady(true);
      // await SplashScreen.hideAsync(); // ✅ Hide splash screen after loading
    };

    loadResources();
  }, []);

  // ✅ Hide splash screen after UI updates
  const onLayoutRootView = useCallback(async () => {
    requestAnimationFrame(async () => { 
      try {
        await SplashScreen.hideAsync(); // ✅ Prevents errors if already hidden

        // ✅ Delay tab bar by 1 second
        setTimeout(() => {
          setShowTabBar(true);
          navigation.setOptions({ tabBarStyle: { display: "flex" } });
        }, 5000);
      } catch (e) {
        console.warn("SplashScreen already hidden or error:", e);
      }
    });
  }, [appReady]);

  if (!appReady) {
    return (
      <ImageBackground
        source={require("@/assets/images/splash-background.png")} // ✅ Use full-screen splash
        style={styles.background}
        resizeMode="cover"
      />
    );
  }

=======
      // Launch image picker
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });

      if (pickerResult.canceled) {
        Alert.alert("Upload Cancelled", "You didn't pick any image.");
        return;
      }

      // Ensure the pickerResult.assets is not empty
      if (!pickerResult.assets || pickerResult.assets.length === 0) {
        Alert.alert("No Image Selected", "No image was selected. Please try again.");
        return;
      }

      // Access the first asset's URI
      const { uri } = pickerResult.assets[0];

      // If an image is selected, upload and process it
      setLoading(true);
      const formData = new FormData();
      formData.append("image", {
        uri,
        type: "image/jpeg",
        name: "uploaded_photo.jpg",
      } as unknown as Blob);

      await uploadPhoto(formData);
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "An error occurred while selecting the image.");
    } finally {
      setLoading(false);
    }
  };

  async function uploadPhoto(photoData: FormData): Promise<void> {
    try {
      const response = await axios.post("https://api.imgur.com/3/image", photoData, {
        headers: {
          "Authorization": `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const { data } = response;
      if (data.success) {
        await detectTextFromImage(data.data.link);  // Call your function to detect text from the uploaded image
        Alert.alert("Success", `Image uploaded: ${data.data.link}`);
      } else {
        Alert.alert("Error", "Failed to upload image.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Upload Error", "Something went wrong!");
    }
  }

  async function detectTextFromImage(imageLink: string): Promise<void> {
    try {
        console.log("Google Vision API Key: AIzaSyDFXACzuiodXtuRhmQg_Ioc0-w-CaPwENI");
        const visionApiUrl = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDFXACzuiodXtuRhmQg_Ioc0-w-CaPwENI";
        const requestBody = {
        requests: [
          {
            image: {
              source: { imageUri: imageLink },
            },
            features: [
              {
                type: "TEXT_DETECTION",
                maxResults: 1,
              },
            ],
          },
        ],
      };

      const response = await axios.post(visionApiUrl, requestBody);
      const textAnnotations = response.data.responses[0].textAnnotations;

      if (textAnnotations && textAnnotations.length > 0) {
        const detectedText = textAnnotations[0].description;
        Alert.alert("Text Detected", detectedText);
        console.log("Detected Text:", detectedText);
      } else {
        Alert.alert("No Text Detected", "No text found in the image.");
      }
    } catch (error) {
      console.error("Error in text detection:", error);
      Alert.alert("Text Detection Error", "Failed to detect text from the image.");
    }
  }
>>>>>>> 6bc2f2f81b376e85c00a355839975eeed3dd9d90

  return (
    <ImageBackground
      source={require('@/assets/images/background.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.background}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">LUNA</ThemedText>
          <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle">
              Get started by scanning or uploading a food label
            </ThemedText>

            {/* Scan Button */}
            <ButtonComponent title="SCAN" onPress={() => router.push('/(tabs)/camera')} />
            {/* Upload Button */}
            <ButtonComponent title={loading ? "Uploading..." : "UPLOAD"} onPress={handleUploadPress} />
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: 50,
  },
  stepContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 0,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 1,
  },
});

<<<<<<< HEAD
    // starter code fomr expo
    //   <ThemedView style={styles.stepContainer}>
    //     <ThemedText type="subtitle">Step 1: Try it</ThemedText>
    //     <ThemedText>
    //       Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
    //       Press{' '}
    //       <ThemedText type="defaultSemiBold">
    //         {Platform.select({
    //           ios: 'cmd + d',
    //           android: 'cmd + m',
    //           web: 'F12'
    //         })}
    //       </ThemedText>{' '}
    //       to open developer tools.
    //     </ThemedText>
    //   </ThemedView>
    //   <ThemedView style={styles.stepContainer}>
    //     <ThemedText type="subtitle">Step 2: Explore</ThemedText>
    //     <ThemedText>
    //       Tap the Explore tab to learn more about what's included in this starter app.
    //     </ThemedText>
    //   </ThemedView>
    //   <ThemedView style={styles.stepContainer}>
    //     <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
    //     <ThemedText>
    //       When you're ready, run{' '}
    //       <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
    //       <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
    //       <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
    //       <ThemedText type="defaultSemiBold">app-example</ThemedText>.
    //     </ThemedText>
    //   </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   content: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   titleContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     gap: 8,
//     backgroundColor: 'transparent',
//     marginTop: 50,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
//   signUpButton: {
//     backgroundColor: "#4CAF50",
//     paddingVertical: 12,
//     paddingHorizontal: 32,
//     borderRadius: 25,
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 50,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
// });
=======
>>>>>>> 6bc2f2f81b376e85c00a355839975eeed3dd9d90
