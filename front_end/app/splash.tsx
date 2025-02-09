import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import React from "react";

export default function SplashScreen() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      router.replace('/');  // ✅ Automatically navigate to home after 12 seconds
    }, 12000000);

    return () => clearTimeout(timer); // ✅ Cleanup timer on unmount
  }, []);

  if (!isVisible) return null;

  return (
    <ImageBackground
          source={require('@/assets/images/splash-background.png')} // your background image
          style={styles.background} // styles to make it cover the whole screen
          resizeMode="cover" // makes the image cover the screen
        >
        </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
