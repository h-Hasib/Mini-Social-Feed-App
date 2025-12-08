import SafeScreen from "@/components/SafeScreen";
import { Slot, useRouter } from "expo-router";
import React from "react";
import { ThemeProvider } from '../context/ThemeContext';
import PushNotificationManager from "../components/PushNotificationManager";
// import { PushNotificationManager } from 
export default function RootLayout() {
  return (
      <PushNotificationManager>
        <SafeScreen>
          <Slot screenOptions={{ headerShown: true }} />
        </SafeScreen>
      </PushNotificationManager>
  );
}
