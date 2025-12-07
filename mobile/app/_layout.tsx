import SafeScreen from "@/components/SafeScreen";
import { Slot, useRouter } from "expo-router";
import React from "react";
import { ThemeProvider } from '../context/ThemeContext';

export default function RootLayout() {
  return (
      <SafeScreen>
        <Slot screenOptions={{ headerShown: true }} />
      </SafeScreen>
  );
}
