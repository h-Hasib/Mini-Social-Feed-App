// src/services/postService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

const POSTS_KEY = "dummy_user_posts";

const DUMMY = [
  {
    id: "p1",
    userId: "user-1",
    username: "Hasibul Hasan",
    text: "Hello from my profile! This is a sample post.",
    date: new Date().toISOString(),
  },
  {
    id: "p2",
    userId: "user-1",
    username: "Hasibul Hasan",
    text: "Another post to test profile editing and deletion.",
    date: new Date().toISOString(),
  },
];

async function ensureInit() {
  const raw = await AsyncStorage.getItem(POSTS_KEY);
  if (!raw) {
    await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(DUMMY));
  }
}

export async function getPostsByUser(userId: string) {
  await ensureInit();
  const raw = await AsyncStorage.getItem(POSTS_KEY);
  const all = raw ? JSON.parse(raw) : [];
  return all.filter((p: any) => p.userId === userId).sort((a: any, b: any) => (b.date > a.date ? 1 : -1));
}

export async function deletePost(id: string) {
  const raw = await AsyncStorage.getItem(POSTS_KEY);
  const all = raw ? JSON.parse(raw) : [];
  const filtered = all.filter((p: any) => p.id !== id);
  await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(filtered));
  return true;
}

export async function updatePost(id: string, payload: any) {
  const raw = await AsyncStorage.getItem(POSTS_KEY);
  const all = raw ? JSON.parse(raw) : [];
  const updated = all.map((p: any) => (p.id === id ? { ...p, ...payload, date: new Date().toISOString() } : p));
  await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  return updated.find((p: any) => p.id === id);
}

export async function createPost(payload: any) {
  const raw = await AsyncStorage.getItem(POSTS_KEY);
  const all = raw ? JSON.parse(raw) : [];
  const post = { id: uuidv4(), ...payload, date: new Date().toISOString() };
  all.unshift(post);
  await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(all));
  return post;
}
