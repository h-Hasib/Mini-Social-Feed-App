// src/services/userService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const DEFAULT_USER = {
  id: "user-1",
  name: "Hasibul Hasan",
  email: "hasib@example.com",
  phone: "+8801712345678",
  theme: "coffee",
};

const USER_KEY = "dummy_user_profile";

export async function getUser(id: string) {
  const raw = await AsyncStorage.getItem(USER_KEY);
  if (raw) {
    return JSON.parse(raw);
  }
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(DEFAULT_USER));
  return DEFAULT_USER;
}

export async function updateUser(payload: any) {
  const existing = (await getUser(payload.id)) || DEFAULT_USER;
  const updated = { ...existing, ...payload };
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(updated));
  return updated;
}
