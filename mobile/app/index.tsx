import { Redirect } from "expo-router";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/services/authService";

export default function Index() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = async () => {
    const u = await getCurrentUser();
    setUser(u?.id || null);
    setLoading(false);
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  if (loading) return null; // or a splash screen

  if (!user) return <Redirect href="/(auth)/login" />;

  return <Redirect href="/(tabs)/feed" />;
}
