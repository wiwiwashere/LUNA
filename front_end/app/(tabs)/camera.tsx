import PhotoPreviewSection from '@/components/PhotoPreviewSection';
import { AntDesign } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import React from 'react';
import { useRef, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useRouter } from "expo-router"
import axios from 'axios';

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
  const router = useRouter();

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
          setPhoto(takenPhoto.uri);

        const photoData = new FormData();
            photoData.append("image", {
                uri: takenPhoto.uri, 
                type: "image/jpeg", 
                name: "photo.jpg"} as any);

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
        const imageUrl = data.data.link;
        await handleSendToOpenAI();
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

  // async function sendToFirebase(imageLink: string): Promise <void>{
  //   try {
  //     const backendUrl = "https://us-central1-luna-d4ef6.cloudfunctions.net/storeImageLink";
  
  //     const response = await axios.post(backendUrl, {
  //       imageLink,
  //     });
  
  //     console.log("Firebase response:", response.data);
  //   } catch (error) {
  //     console.error("Error sending image link to Firebase:", error);
  //     Alert.alert("Error", "Failed to save image link to Firebase.");
  //   }
  // }

  const handleSendToOpenAI = async () => {
    if (!photo) return Alert.alert("Error", "No photo taken.");

    const formData = new FormData();
    formData.append("file", {
      uri: photo,
      type: "image/jpeg",
      name: "photo.jpg",
    } as any);

    formData.append("model", "gpt-4-vision-preview");

    try {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();
      console.log("✅ OpenAI Response:", data);

      if (data) {
        router.push({ pathname: "/results", params: { result: JSON.stringify(data) } });

      }
    } catch (error) {
      console.error("❌ OpenAI API Error:", error);
      Alert.alert("Error", "Failed to send image to OpenAI.");
    }
  };

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
  previewImage: { 
    width: "90%", 
    height: 300, 
    marginBottom: 20 },
});