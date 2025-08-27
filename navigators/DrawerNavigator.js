import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen/SettingsScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import Therapist from '../screens/TherapistScreen/TherapistScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home" // ✅ Changed from "HomeScreen" to "Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        // Remove default header since we have custom header in HomeScreen
        headerShown: false,
        
        // Drawer configuration
        drawerStyle: {
          backgroundColor: '#fff',
          width: 280,
        },
        drawerType: 'front', // Makes sure drawer slides over content
        
        // Gesture configuration
        swipeEnabled: true,
        swipeEdgeWidth: 50, // Increase touch area for swipe gesture
        
        // Animation
        drawerHideStatusBarOnOpen: false,
        overlayColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <Drawer.Screen 
        name="Home" // ✅ This matches your menu items
        component={HomeScreen}
        options={{
          title: 'Home',
          drawerIcon: ({ focused, color }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />
      
      <Drawer.Screen 
        name="Profile" // ✅ This matches your menu items
        component={ProfileScreen}
        options={{
          title: 'Profile',
          drawerIcon: ({ focused, color }) => (
            <Ionicons 
              name={focused ? 'person' : 'person-outline'} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />
      
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
          drawerIcon: ({ focused, color }) => (
            <Ionicons 
              name={focused ? 'settings' : 'settings-outline'} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />

       <Drawer.Screen 
        name="Therapist"
        component={Therapist}
        options={{
          drawerItemStyle: { display: 'none' }, // hides from drawer
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;