import PhotoPreviewSection from '@/components/PhotoPreviewSection';
import { AntDesign } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import React from 'react';
import { useRef, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import { AxiosError } from 'axios';

interface ButtonProps {
  onPress: () => void;
  title: string;
}

const ButtonComponent: React.FC<ButtonProps> = ({ onPress, title }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 10, backgroundColor: '#4CAF50', borderRadius: 5 }}>
      <Text style={{ color: 'white', textAlign: 'center' }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }
  

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission To Access Camera" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: true,
        exif: false,
      };
      const takenPhoto = await cameraRef.current.takePictureAsync(options);

        if (takenPhoto) {
          setPhoto(takenPhoto);

        const photoData = new FormData();
            photoData.append("image", {
                uri: takenPhoto.uri, 
                type: "image/jpeg", 
                name: "photo.jpg"} as unknown as Blob);

                uploadPhoto(photoData);
              } else {
                Alert.alert("Error", "Failed to capture photo.");
              }
            }
          };

  async function uploadPhoto (photoData: FormData): Promise <void>{
    try {
      const response = await axios.post("https://api.imgur.com/3/image", photoData, {
    
        headers: {
          "Authorization": `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
          "Content-Type": "multipart/form-data"

      }
    });
  
      // Convert response headers to a usable format
      const clientRemaining = response.headers["x-ratelimit-clientremaining"];
      console.log("Client Remaining:", clientRemaining);
  
      const data = await response.data;
  
      if (data.success) {
        await detectTextFromImage(data.data.link);
        // await sendToFirebase(data.data.link);
        Alert.alert("Success!", `Image uploaded to Imgur: ${data.data.link}`);
        console.log(`${data.data.link}`);
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
              source: {
                imageUri: imageLink, 
              },
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
  
      // Make the request to Google Vision API
      const response = await axios.post(visionApiUrl, requestBody);
      console.log('Google Vision API Response:', response.data); // Log full response

  
      const textAnnotations = response.data.responses[0].textAnnotations;
  
      if (textAnnotations && textAnnotations.length > 0) {
        const detectedText = textAnnotations[0].description;
        Alert.alert("Text Detected", detectedText);
        console.log("Detected Text: ", detectedText); // Log the detected text
        extractIngredients(detectedText);
      } else {
        Alert.alert("No Text Detected", "No text found in the image.");
      }
    } catch (error) {
      console.error("Error in text detection:", error);
  
      if (error instanceof AxiosError) {
        // Log the full error response if available
        if (error.response) {
          console.error("Error response:", error.response.data);
        } else {
          console.error("No response from server:", error.message);
        }
      } else {
        console.error("An unexpected error occurred:", error);
      }
  
      Alert.alert("Text Detection Error", "Failed to detect text from the image.");
    }
  }
  function extractIngredients(text: string): string[] {
    const match = text.match(/ingredients: (.*?\.)/i); // Capture from "ingredients" to the first period
    if (!match) return []; // Return empty array if no match

    return match[1] // Extract matched text
        .replace(/\./, '') // Remove the final period
        .split(/\s*,\s*/) // Split by commas, trimming spaces
        .map(item => item.trim()) // Trim each ingredient
        .filter(item => item.length > 0); // Remove empty items
}
  

  const handleRetakePhoto = () => setPhoto(null);

  if (photo) return <PhotoPreviewSection photo={photo} handleRetakePhoto={handleRetakePhoto} />;

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <AntDesign name="retweet" size={44} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <AntDesign name="camera" size={44} color="black" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Added to ensure centering of content
  },
  camera: {
    flex: 1,
    width: '100%', // Ensuring camera takes up full screen width
    height: '100%', // Ensuring camera takes up full screen height
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100, // Ensure buttons are at the bottom of the camera screen
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  button: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slight background for button visibility
    borderRadius: 50,
    padding: 15,
  },
});