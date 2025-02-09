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

  // pull user
  // useEffect(() => {
  //   const auth = getAuth(); // Get the auth instance
  
  //   const user = auth.currentUser; // Get the current signed-in user
  
  //   if (user) {
  //     console.log("User is signed in:", user.email); // Access user details like email, uid, etc.
  //   } else {
  //     console.log("No user is signed in.");
  //   }
  // }, []);

  // insets
  const insets = useSafeAreaInsets();

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


  return (
    // whole screen
    <ImageBackground
      source={require('@/assets/images/background.jpg')} // your background image
      style={styles.backgroundImage} // styles to make it cover the whole screen
      resizeMode="cover" // makes the image cover the screen
    >

      <SafeAreaView style={styles.background}>
      {/* title box */}
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">LUNA</ThemedText>

          {/* welcome user and greet them by name
          <ThemedText type="welcome">Welcome, {user.email}</ThemedText> */}

          {/* container for subtitle / instructions */}
          <ThemedView style={[styles.stepContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            {/* mini thing to tell users what to do */}
            <ThemedText type="subtitle">get started by scanning or uploading a food label</ThemedText>

            {/* scan Button */}
            {/* <ButtonComponent onPress={handleCameraPress} title="SCAN" /> */}

            <ButtonComponent title="SCAN" onPress={handleCameraPress}/>
          
            {/* upload button */}
            <ButtonComponent onPress={handleUploadPress} title="UPLOAD" />
            
          </ThemedView>

        </ThemedView>

        {/* Conditionally render Camera component */}
        {isCameraVisible && <Camera />}
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
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backgroundImage: {
    position: 'absolute', // Ensures it stays in place
    width: '100%', 
    height: '100%',
    flex: 1,
  },
});

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