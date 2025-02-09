import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Alert, ImageBackground } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // Correct import
import ButtonComponent from '@/components/Button';
import { useLocalSearchParams } from "expo-router";

// ok
import { firebaseConfig } from '../../firebaseConfig';
import { initializeApp } from 'firebase/app';

export default function  ProfileScreen(){
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  console.log("hereherere");
  const { userId } = useLocalSearchParams();  // Get userId from URL
  console.log(userId, );

  // Listen for authentication state changes
  useEffect(() => {
    // Firebase initialization inside useEffect
    // const app = initializeApp(firebaseConfig);
    // const auth = getAuth(app);

    console.log('auth object!!!!!!:', auth);  // Debugging log
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log('setUser user what is user', user);
      } else {
        router.replace("/(tabs)/login");
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch user data after authentication
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://10.136.1.40:5000/api/user/${data.user.uid}`);
        const data = await response.json();

        if (response.ok) {
          setUsername(data.username);
        } else {
          Alert.alert('Error', data.error);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = () => {
    router.push('/(tabs)/login');
  };

  return (
    <ImageBackground
      source={require('@/assets/images/background.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.background}>
        <ButtonComponent
          title="LOGOUT"
          onPress={handleLogout}
          style={{
            padding: 7,
            width: 100,
            marginBottom: 0,
            marginTop: 60,
            bottom: 50,
            left: 140
          }}
          textStyle={{ fontSize: 13 }}
        />

        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">{username}</ThemedText>
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
    marginTop: 0,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 1,
  },
});
