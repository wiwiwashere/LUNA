import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// import { useEffect, useState } from 'react';
// import { Alert } from 'react-native';
// import { auth } from '@/firebaseConfig';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  // const router = useRouter();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     setIsAuthenticated(!!user);
  //   });

  //   return () => unsubscribe();
  // }, []);

  // const handleProfileAccess = () => {
  //   if (!isAuthenticated) {
  //     Alert.alert(
  //       "Login Required",
  //       "You must log in to access your profile.",
  //       [
  //         { text: "Cancel", style: "cancel" },
  //         { text: "Log In", onPress: () => router.push('/(tabs)/login') }
  //       ]
  //     );
  //     return false;
  //   }
  //   return true;
  // };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          href: null, // Hides it from the tab bar
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null, // Hides it from the tab bar
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          title: 'Sign Up',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="reults"
        options={{
          title: 'Results',
          href: null,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
