import SafeScreen from "@/components/SafeScreen";
import { Slot, useRouter } from "expo-router";
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import React, { useEffect, useState } from "react";
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { ActivityIndicator, View } from "react-native";

const CLERK_PUBLISHABLE_KEY = "pk_test_Ym9zcy1vcmNhLTkyLmNsZXJrLmFjY291bnRzLmRldiQ";

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <SafeScreen>
        <AuthCheckWrapper>
          <Slot screenOptions={{ headerShown: true }} />
        </AuthCheckWrapper>
      </SafeScreen>
    </ClerkProvider>
  );
}

function AuthCheckWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark that the component has mounted
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isLoaded) return;

    // Safe to navigate now
    router.replace(isSignedIn ? "/(tabs)/feed" : "/login");
  }, [mounted, isLoaded, isSignedIn]);

  // Always render children immediately to satisfy Slot requirement
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#8B593E" />
      </View>
    );
  }

  return <>{children}</>;
}
