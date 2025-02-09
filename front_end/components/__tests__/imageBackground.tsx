import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';

const BackgroundWithFixedRatio: React.FC = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/background.jpg')} // Replace with the correct path to your image
        style={styles.background}
        resizeMode="contain"  // or "contain" depending on your needs
      >
        {/* You can add other content here that sits on top of the background */}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,                   // Fills the entire screen
    justifyContent: 'center',  // Centers the content vertically (optional)
    alignItems: 'center',      // Centers the content horizontally (optional)
    backgroundColor: '#fff',
  },
  background: {
    width: '100%',             // The image will take the full width of its container
    // aspectRatio: 16 / 9,       // This ensures the height is automatically computed to keep a 16:9 ratio
  },
});

export default BackgroundWithFixedRatio;