import SafeScreen from "@/components/SafeScreen";
import { Slot } from "expo-router";
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import React from "react";
import { ClerkProvider } from '@clerk/clerk-expo';

const CLERK_PUBLISHABLE_KEY = "pk_test_Ym9zcy1vcmNhLTkyLmNsZXJrLmFjY291bnRzLmRldiQ";

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >  
      <SafeScreen >
        <Slot screenOptions={{headerShown: true}}/>
      </SafeScreen>
    </ClerkProvider>
  );
}


