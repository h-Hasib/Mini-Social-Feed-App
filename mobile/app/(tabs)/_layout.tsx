import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feed from './feed';
import CreatePost from './createPost';
import ProfileScreen from './profile';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
        backgroundColor: COLORS.background,
        height: 70,
        },
        tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
      },
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string = 'home';
        let IconComponent: any = Ionicons;
        if (route.name === 'Feed') {
          iconName = focused ? 'home' : 'home-outline';
          IconComponent = Ionicons;
        } else if (route.name === 'Post') {
          iconName = focused ? 'plus-circle' : 'plus';
          IconComponent = FontAwesome5;
        } else if (route.name === 'Profile') {
          iconName = focused ? 'user-alt' : 'user';
          IconComponent = FontAwesome5;
        }
        return <IconComponent name={iconName as any} size={28} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Post" component={CreatePost} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
