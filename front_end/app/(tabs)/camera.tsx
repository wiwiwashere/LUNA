import PhotoPreviewSection from '@/components/PhotoPreviewSection';
import { AntDesign } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import React from 'react';
import { useRef, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';


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
        <Button onPress={requestPermission} title="Grant Permission To Acess Camera" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const handleTakePhoto =  async () => {
    if (cameraRef.current) {
        const options = {
            quality: 1,
            base64: true,
            exif: false,
        };
        const takedPhoto = await cameraRef.current.takePictureAsync(options);

        if (takedPhoto) {
          setPhoto(takedPhoto);

        const photoData = new FormData();
            photoData.append("image", {
                uri: takedPhoto.uri, 
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
      const response = await axios.post("https://api.imgur.com/3/", photoData, {
    
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
        await sendToFirebase(data.data.link);
        Alert.alert("Success!", `Image uploaded to Imgur: ${data.data.link}`);
      } else {
        Alert.alert("Error", "Failed to upload image.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Upload Error", "Something went wrong!");
    }
  }

  async function sendToFirebase(imageLink: string): Promise <void>{

  }

  const handleRetakePhoto = () => setPhoto(null);

  if (photo) return <PhotoPreviewSection photo={photo} handleRetakePhoto={handleRetakePhoto} />

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <AntDesign name='retweet' size={44} color='black' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <AntDesign name='camera' size={44} color='black' />
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
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginTop: 'auto',
    marginBottom: 100,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: 'gray',
    borderRadius: 50,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});