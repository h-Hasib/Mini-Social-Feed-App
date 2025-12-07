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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutUser } from '../../services/authService';
import { getCurrentUser } from '../../services/authService';
import { StyleSheet } from 'react-native';
import { getPostsByUser } from '../../services/postService';


export default function ProfileScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<postService.Post[]>([]);
  const flatListRef = React.useRef<FlatList<any> | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { themeName, themes, setThemeName } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pwModalVisible, setPwModalVisible] = useState(false);
  const [editPost, setEditPost] = useState<any | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const themeOptions = Object.keys(themes) as ThemeKey[];
  const [error, setError] = useState('');
  

  useEffect(() => {
    loadUserProfile();
    fetchPosts();
  }, []);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      // Get user from AsyncStorage
      const userJson = await AsyncStorage.getItem('user');
      
      if (userJson) {
        const userData = JSON.parse(userJson);
        setUser(userData);
        
        // Fetch user's posts using their ID
        const userPosts = await getPostsByUser(userData.id);
        setPosts(userPosts);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchPosts = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const data = await getPostsByUser(user.id)
      setPosts(data);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch posts");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 200);
  };

  const handleSignOut = async () => {
    setError('');
    setLoading(true);
    try {
      await logoutUser();
      router.replace('/(auth)/login'); // Navigate back to login
    } catch (err: any) {
      setError(err.message);
      Alert.alert("Error", "Logout failed, please try again.");
    } finally {
      setLoading(false);
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
            setPosts((prev) => prev.filter((p) => p.id !== id));
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
      setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>No user logged in</Text>
      </View>
    );
  }

  return (
    <View style={ProfileStyles.container}>
      <FlatList
        ref={flatListRef}
        data={posts}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={fetchPosts}
        onEndReachedThreshold={0.5}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ padding: 16, paddingBottom: 50, marginBottom: 50 }}
        ListHeaderComponent={
          <>
            {/* User Info */}
            <View style={ProfileStyles.header}>
              <UserAvatar name={user.userName} size={96} />
              <Text style={ProfileStyles.name}>{user.userName}</Text>
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
        ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
        ListEmptyComponent={
          <Text style={ProfileStyles.emptyText}>No posts yet.</Text>
        }
      />
      {showScrollTop && posts.length > 0 && (
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
                onPress: handleSignOut,
              },
            ])
          }
          disabled={loading}
        >
          <Text style={ProfileStyles.buttonText}>{loading ? 'Logging Out...' : 'Logout'}</Text>
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  userId: {
    fontSize: 12,
    color: '#999',
  },
  postsSection: {
    flex: 1,
    padding: 15,
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  postCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  postContent: {
    fontSize: 14,
    color: '#555',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});