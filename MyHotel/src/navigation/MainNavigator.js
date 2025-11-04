import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

 
import Explore from '../screens/Home/Explore';
import HotelDetails from '../screens/Home/HotelDetails';
import Booking from '../screens/Home/Booking';
import BookingConfirmation from '../screens/Home/BookingConfirmation';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfile from '../screens/Profile/EditProfile';
import Deals from '../screens/Home/Deals';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

 
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Explore" 
        component={Explore} 
        options={{ title: 'Find Hotels' }}
      />
      <Stack.Screen 
        name="HotelDetails" 
        component={HotelDetails}
        options={{ title: 'Hotel Details' }}
      />
      <Stack.Screen 
        name="Booking" 
        component={Booking}
        options={{ title: 'Book Room' }}
      />
      <Stack.Screen 
        name="BookingConfirmation" 
        component={BookingConfirmation}
        options={{ title: 'Booking Confirmed', headerLeft: null }}
      />
    </Stack.Navigator>
  );
}

 
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ title: 'My Profile' }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfile}
        options={{ title: 'Edit Profile' }}
      />
    </Stack.Navigator>
  );
}

 
export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Deals') {
            iconName = focused ? 'pricetag' : 'pricetag-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Deals" 
        component={Deals}
        options={{ title: 'Special Deals' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}