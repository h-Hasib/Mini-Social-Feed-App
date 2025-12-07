import SafeScreen from "@/components/SafeScreen";
import { Slot, useRouter } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <SafeScreen>
      <Slot screenOptions={{ headerShown: true }} />
    </SafeScreen>
  );
}
