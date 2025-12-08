import React, { useEffect, PropsWithChildren } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { savePushToken } from '@/services/userService';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true, 
  }),
});

const PushNotificationManager: React.FC<PropsWithChildren<{}>> = ({ children }) => {

  // Register for push notifications
  const registerForPushNotificationsAsync = async (): Promise<string | undefined> => {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permissions if not already granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      // Check if permissions are granted
      if (finalStatus !== 'granted') {
        console.warn('Failed to get push token for push notification!');
        return;
      }

      // Get Expo Push Token
      try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;

        if (!projectId) {
          console.error('No project ID found. Please configure in app.json');
          return;
        }

        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId: projectId,
          })
        ).data;
    
        console.log('Push Token:', token);
        return token
      } catch (error) {
        console.error('Detailed Error getting push token:', error);

        if (error instanceof Error) {
          console.error('Error name:', error.name);
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        }
      }
    } else {
      console.warn('Must use physical device for Push Notifications');
    }

    return token;
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then( async (token) => {
      if (token) { 
        try {
          await savePushToken(token);
          console.log("Push token saved to backend");
        } catch (e) {
          console.log("Error saving token", e);
        }
      }
    });

    // Notification received listener
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log(
          'Notification Received:',
          notification.request.content.data,
        );
      },
    );

    // Notification tap listener
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log('Notification Tapped:', data);
      });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return <>{children}</>;
};

export default PushNotificationManager;