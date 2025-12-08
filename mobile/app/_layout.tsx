import SafeScreen from "@/components/SafeScreen";
import { Slot } from "expo-router";
import React from "react";
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
