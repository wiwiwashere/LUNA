import PhotoPreviewSection from '@/components/PhotoPreviewSection';
import { AntDesign } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import React from 'react';
import { useRouter } from 'expo-router';
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
  const router = useRouter();
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
      console.log("Imgur ID", "424c90175b7197a");
      const Id = "424c90175b7197a";
      const response = await axios.post("https://api.imgur.com/3/image", photoData, {
    
        headers: {
          "Authorization": `Client-ID 424c90175b7197a`,
          "Content-Type": "multipart/form-data"

      }
    });
    console.log(response.data);
    console.log("sent to imgurapi");
  
      // Convert response headers to a usable format
      const clientRemaining = response.headers["x-ratelimit-clientremaining"];
      console.log("Client Remaining:", clientRemaining);
  
      const data = await response.data;
  
      if (data.success) {
        await detectTextFromImage(data.data.link);
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
      console.log("Starting text detection for image:", imageLink);
      const visionApiUrl = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDFXACzuiodXtuRhmQg_Ioc0-w-CaPwENI";
      
      const requestBody = {
        requests: [{
          image: {
            source: {
              imageUri: imageLink, 
            },
          },
          features: [{
            type: "TEXT_DETECTION",
            maxResults: 1,
          }],
        }],
      };
  
      console.log("Sending request to Vision API...");
      const response = await axios.post(visionApiUrl, requestBody);
      console.log('Full Vision API Response:', response.data);
  
      if (!response.data.responses || !response.data.responses[0]) {
        console.error("Invalid response structure:", response.data);
        throw new Error("Invalid API response structure");
      }
  
      const textAnnotations = response.data.responses[0].textAnnotations;
      console.log("Text annotations:", textAnnotations);
  
      if (textAnnotations && textAnnotations.length > 0) {
        const detectedText = textAnnotations[0].description;
        console.log("Raw detected text:", detectedText);
        
        // Extract ingredients
        const ingredients = extractIngredients(detectedText);
        console.log("Extracted ingredients:", ingredients);
  
        if (ingredients.length === 0) {
          Alert.alert("No Ingredients Found", "Could not find an ingredients list in the image.");
          return;
        }
  
        // Navigate to results
        console.log("Navigating to results with ingredients:", ingredients);
        router.push({
          pathname: "/(tabs)/results/",
          params: {
            ingredients: JSON.stringify(ingredients),  // Directly pass the ingredients array
          }
        });
      } else {
        console.error("No text annotations found");
        Alert.alert("No Text Detected", "No text found in the image.");
      }
    } catch (error) {
      console.error("Full error object:", error);
      if (error instanceof AxiosError) {
        console.error("API Error details:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      Alert.alert("Text Detection Error", "Failed to detect text from the image.");
    }
  }
  function extractIngredients(text: string): string[] {
    console.log("Starting ingredient extraction from text:", text);
    
    // Try different patterns to find ingredients
    const patterns = [
      /INGREDIENTS?:?\s*([\s\S]+?)(?:\.|$)/i,  // Standard format
      /CONTAINS?:?\s*([\s\S]+?)(?:\.|$)/i,     // Alternative format
      /MADE WITH:?\s*([\s\S]+?)(?:\.|$)/i      // Another alternative
    ];
    
    let match = null;
    for (const pattern of patterns) {
      match = text.match(pattern);
      if (match) break;
    }
    
    if (!match) {
      console.log("No ingredients section found with any pattern");
      return [];
    }
    
    const ingredientText = match[1];
    console.log("Found ingredient text:", ingredientText);
    
    // Split by multiple possible delimiters
    const ingredients = ingredientText
      .replace(/\n/g, ' ')          // Replace newlines with spaces
      .replace(/\([^)]*\)/g, '')    // Remove parenthetical contents
      .split(/[,.]/)                // Split by comma or period
      .map(item => item.trim())
      .filter(item => 
        item.length > 0 && 
        !item.toLowerCase().includes('contains') && 
        !item.toLowerCase().includes('may contain')
      );
    
    console.log("Final processed ingredients:", ingredients);
    return ingredients;
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