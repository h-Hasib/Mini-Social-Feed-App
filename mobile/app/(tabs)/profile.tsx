import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import UserAvatar from "@/components/UserAvatar";
import ThemeCard from "@/components/ThemeCard";
import PostItem from "@/components/PostItem";
import { ProfileStyles } from "@/assets/styles/profile.styles";
import { styles as feedStyles } from "@/assets/styles/feed.styles";
import { useTheme } from "@/context/ThemeContext";
import * as userService from "@/services/userService";
import * as postService from "@/services/postService";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import EditPostModal from "@/components/EditPostModal";
import { ThemeKey } from "@/constants/colors";
import * as Linking from 'expo-linking'

export default function ProfileScreen() {
  const router = useRouter();
  const { themeName, themes, setThemeName } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [pwModalVisible, setPwModalVisible] = useState(false);
  const [editPost, setEditPost] = useState<any | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const themeOptions = Object.keys(themes) as ThemeKey[];
  const flatListRef = useRef<FlatList>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    loadProfile();
    loadMyPosts();
  }, []);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 200);
  };

  
  const handleSignOut = async () => {
    try {
      // await signOut()
      // Redirect to Login
      Linking.openURL(Linking.createURL('/(auth)/login'))
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  async function loadProfile() {
    setLoading(true);
    try {
      const u = await userService.getUser("user-1");
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
      const posts = await postService.getPostsByUser("user-1");
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

  if (loading || !user) {
    return (
      <View style={[ProfileStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={themes[themeName].primary} />
      </View>
    );
  }

  return (
    <View style={ProfileStyles.container}>
      <FlatList
        ref={flatListRef}
        data={myPosts}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={loadMyPosts}
        onEndReachedThreshold={0.5}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ padding: 16, paddingBottom: 50, marginBottom: 50 }}
        ListHeaderComponent={
          <>
            {/* User Info */}
            <View style={ProfileStyles.header}>
              <UserAvatar name={user.name} size={96} />
              <Text style={ProfileStyles.name}>{user.name}</Text>
              <Text style={ProfileStyles.email}>{user.email}</Text>
              {user.phone && <Text style={ProfileStyles.phone}>{user.phone}</Text>}
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
              <FlatList
                horizontal
                data={themeOptions}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <ThemeCard
                    themeKey={item}
                    theme={themes[item]}
                    active={themeName === item}
                    onPress={() => setThemeName(item)}
                  />
                )}
                contentContainerStyle={{ paddingVertical: 8 }}
              />
            </View>

            {/* Section Title for Posts */}
            <View style={ProfileStyles.section}>
              <Text style={ProfileStyles.sectionTitle}>Your posts</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <PostItem
            post={item}
            onEdit={() => setEditPost(item)}
            onDelete={() => handleDeletePost(item.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <Text style={ProfileStyles.emptyText}>No posts yet.</Text>
        }
      />
      {showScrollTop && myPosts.length > 0 && (
        <TouchableOpacity
          style={[feedStyles.scrollTopButton, {marginBottom: 50}]}
          onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
        >
          <Text style={feedStyles.scrollTopArrow}>↑</Text>
        </TouchableOpacity>
      )}

      {/* Logout */}
      <View style={{ padding: 16 }}>
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
                    await handleSignOut();
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
