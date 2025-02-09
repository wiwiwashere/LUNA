import { StyleSheet, Image, Platform, SafeAreaView, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Make sure this is imported
import { ThemedView } from '@/components/ThemedView';
import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ButtonComponent from '@/components/Button';
import { useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore'; 
import Constants from 'expo-constants'; // Import expo-constants

// might delete later
import { auth, onAuthStateChanged } from '@/firebaseConfig';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Safe area insets
  const insets = useSafeAreaInsets();

  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);  // User is logged in
      } else {
        router.replace("/login"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://your-backend-url.com/api/user/${user.uid}`);
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

  // action for logout
  const handleLogut = () => {
    router.push('/(tabs)/login'); 
  };

  if (loading) {
    return <ThemedText>Loading...</ThemedText>; // Show loading state while fetching data
  }

  return (
    <ImageBackground
      source={require('@/assets/images/background.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.background}>
        <ButtonComponent
          title="LOGOUT"
          onPress={handleLogut}
          style={{
            padding: 7, 
            width: 100, 
            marginBottom: 0,
            marginTop: 60,
            bottom: 50,
            left: 140
          }}
          textStyle={{ fontSize: 13}}
        />

        <ThemedView style={styles.titleContainer}>
          {/* Dynamically displaying the fetched username */}
          <ThemedText type="title">{username || "Loading..."}</ThemedText> 
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