
// import { View, Text } from 'react-native'
// import React from 'react'
// import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
// import { Link } from 'expo-router'
// import { SignOutButton } from '@/components/SignOutButton'

// const profile = () => {
//   const { user } = useUser()
//   return (
//     <View>
//       <View>
//       <Text>Profile</Text>
//       </View>
//       <SignedIn>
//         <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
//         <SignOutButton />
//       </SignedIn>
//       <SignedOut>
//         <Link href="/(auth)/login">
//           <Text>Sign in</Text>
//         </Link>
//         <Link href="/(auth)/signup">
//           <Text>Sign up</Text>
//         </Link>
//       </SignedOut>
//     </View>
//   )
// }

// export default profile

// app/(tabs)/profile.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import UserAvatar from "@/components/UserAvatar";
import ThemeCard from "@/components/ThemeCard";
import PostItem from "@/components/PostItem";
import { ProfileStyles } from "@/assets/styles/profile.styles";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import * as userService from "@/services/userService";
import * as postService from "@/services/postService";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import EditPostModal from "@/components/EditPostModal";
import { COLORS, ThemeKey } from "@/constants/colors";

export default function ProfileScreen() {
  const router = useRouter();
  const { themeName, themes, setThemeName } = useTheme();
  const { userId, logout } = useAuth();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [pwModalVisible, setPwModalVisible] = useState(false);
  const [editPost, setEditPost] = useState<any | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProfile();
    loadMyPosts();
  }, []);

  async function loadProfile() {
    setLoading(true);
    try {
      const u = await userService.getUser(userId);
      setUser(u);
    } catch (e) {
      console.warn("Failed to load user", e);
    } finally {
      setLoading(false);
    }
  }

  async function loadMyPosts() {
    setRefreshing(true);
    try {
      const posts = await postService.getPostsByUser(userId);
      setMyPosts(posts);
    } catch (e) {
      console.warn("Failed to load posts", e);
    } finally {
      setRefreshing(false);
    }
  }

  async function handleDeletePost(id: string) {
    Alert.alert("Delete post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await postService.deletePost(id);
            setMyPosts((prev) => prev.filter((p) => p.id !== id));
            Alert.alert("Deleted", "Post deleted");
          } catch (e) {
            Alert.alert("Error", "Could not delete post");
          }
        },
      },
    ]);
  }

  async function handleUpdatePost(updated: any) {
    try {
      const post = await postService.updatePost(updated.id, updated);
      setMyPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
      setEditPost(null);
    } catch (e) {
      Alert.alert("Error", "Could not update post");
    }
  }

  const themeOptions = Object.keys(themes);

  if (loading || !user) {
    return (
      <View style={[ProfileStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={ProfileStyles.container}>
      <ScrollView contentContainerStyle={ProfileStyles.scrollContainer}>
        {/* User Info */}
        <View style={ProfileStyles.header}>
          <UserAvatar name={user.name} size={96} />
          <Text style={ProfileStyles.name}>{user.name}</Text>
          <Text style={ProfileStyles.email}>{user.email}</Text>
          {user.phone ? <Text style={ProfileStyles.phone}>{user.phone}</Text> : null}
        </View>

        {/* Account actions */}
        <View style={ProfileStyles.section}>
          <Text style={ProfileStyles.sectionTitle}>Account</Text>
          <TouchableOpacity
            style={ProfileStyles.button}
            onPress={() => setPwModalVisible(true)}
          >
            <Text style={ProfileStyles.buttonText}>Change Password</Text>
          </TouchableOpacity>
        </View>

        {/* Theme Selection */}
        <View style={ProfileStyles.section}>
          <Text style={ProfileStyles.sectionTitle}>Theme</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 8 }}>
            {themeOptions.map((tName) => {
              const key = tName as ThemeKey;  // cast string to ThemeKey
              return (
                <ThemeCard
                  key={key}
                  themeKey={key}
                  theme={themes[key]}
                  active={themeName === key}
                  onPress={() => setThemeName(key)}
                />
              );
            })}

          </ScrollView>
        </View>

        {/* User posts */}
        <View style={ProfileStyles.section}>
          <Text style={ProfileStyles.sectionTitle}>Your posts</Text>

          <FlatList
            data={myPosts}
            keyExtractor={(item) => item.id}
            refreshing={refreshing}
            onRefresh={loadMyPosts}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <PostItem
                post={item}
                onEdit={() => setEditPost(item)}
                onDelete={() => handleDeletePost(item.id)}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            ListEmptyComponent={<Text style={ProfileStyles.emptyText}>No posts yet.</Text>}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>

        {/* Logout */}
        <View style={ProfileStyles.section}>
          <TouchableOpacity
            style={[ProfileStyles.button, { backgroundColor: "#ff5757" }]}
            onPress={() =>
              Alert.alert("Logout", "Do you want to log out?", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Logout",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      await logout();
                      router.replace("/login"); // or your auth route
                    } catch (e) {
                      Alert.alert("Error", "Logout failed");
                    }
                  },
                },
              ])
            }
          >
            <Text style={ProfileStyles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals */}
      <ChangePasswordModal
        visible={pwModalVisible}
        onClose={() => setPwModalVisible(false)}
        onSuccess={() => {
          setPwModalVisible(false);
          Alert.alert("Success", "Password changed (dummy).");
        }}
      />

      <EditPostModal
        visible={!!editPost}
        post={editPost}
        onClose={() => setEditPost(null)}
        onSave={handleUpdatePost}
      />
    </View>
  );
}

