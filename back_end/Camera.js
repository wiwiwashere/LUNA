import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    Button,
    TouchableOpacity,
    Image,
  } from "react-native";
  import {
    CameraView,
    CameraType,
    useCameraPermissions,
    Camera,
  } from "expo-camera";
  import { useState, useRef, useEffect } from "react";
  import {useIsFocused} from "@react-navigation/native";


  export default function Camera(){
    const [permmision, requestPermission] = useCameraPermissions();
    const isFocused = useIsFocused();
    const cameraRef = useRef(null);


    if (!isFocused){
        return;
    }

    if (!permission){
        return;
    }

    if (!permission.granted){
        return <View/>;//no permission granted
    }

    async function takePicture(){
        console.log("Took Picture");
        if (cameraRef.current){
            const photo = await cameraRef.current.takePictureAsync();
            console.log("Photo Taken");

            const photoData = new FormData();
            photoData.append("image", {
                uri: photo.uri, 
            type: "image/jpeg", 
        name: "photo.jpg"});
        uploadPicture(photodata);
        }
    }
    async function uploadPicture(photoData){
    try{
        let response = await fetch("https://api.imgur.com/3/image", {
            method: "POST",
            headers: {
              "Authorization": `Client-ID ${IMGUR_CLIENT_ID}`,
            },
            body: photoData,
          });
        console.log(
            "Client Remaining:",
            response.headers["x-ratelimit-clientremaining"]
          );
    
    let data = await response.json();
    if (data.success) {
      setUploadedUrl(data.data.link);
      Alert.alert("Success!", "Image uploaded to Imgur: " + data.data.link);
    } else {
      Alert.alert("Error", "Failed to upload image.");
    }
  } catch (error) {
    console.error("Upload error:", error);
    Alert.alert("Upload Error", "Something went wrong!");
  }

  }
}
