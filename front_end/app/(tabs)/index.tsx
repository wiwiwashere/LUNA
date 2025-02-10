import { ImageBackground, SafeAreaView, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import ButtonComponent from '@/components/Button';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  // Handle image upload
  const handleUploadPress = async () => {
    try {
      // Request permissions to access the image gallery
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert("Permission Required", "You need to grant permission to access your photo library.");
        return;
      }

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
  buttonContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 50
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 1,
  },
});