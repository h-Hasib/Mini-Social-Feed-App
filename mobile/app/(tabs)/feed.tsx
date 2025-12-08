import React, { useCallback, useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, Text, Alert, ActivityIndicator } from "react-native";
import SearchBar from "@/components/SearchBar";
import PostCard from "@/components/PostCard";
import { styles as feedStyles } from "@/assets/styles/feed.styles";
import { getAllPosts, getPostsByCategory, getPostsByUserName, Post } from "../../services/postService"
import { COLORS } from "@/constants/colors";
import { getCurrentUser } from '../../services/authService';

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = React.useRef<FlatList<any> | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchName, setSearchName] = useState<string>("");
  const [searchTag, setSearchTag] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const user = await getCurrentUser();
      setCurrentUserId(user?.id || null);
    };
    loadCurrentUser();

    fetchPosts();
  }, []);
 
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getAllPosts();
      setPosts(data);
      setSearchName("");
      setSearchTag("");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to refresh posts");
    } finally {
      setRefreshing(false);
      setSearchName("");
      setSearchTag("");
    }
  };

  const handleUserSearch = async () => {
    if (!searchName.trim()) {
      fetchPosts();
      return;
    }
    setLoading(true);
    try {
      const data = await getPostsByUserName(searchName.trim());
  
      if (data && data.length != 0) {
        setPosts(data);
      }
      else{
        Alert.alert("Error", "No posts found");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCategorySearch = async () => {
    if (!searchTag.trim()) {
      fetchPosts();
      return;
    }
    setLoading(true);
    try {
      const data = await getPostsByCategory(searchTag.trim());
  
      if (data && data.length != 0) {
        setPosts(data);
      }
      else{
        Alert.alert("Error", "No posts found");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 200);
  };

  if (loading) {
    return (
      <View style={[feedStyles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={feedStyles.container}>
      <SearchBar
        value={searchName}
        onChangeText={setSearchName}
        onSearchPress={handleUserSearch}
        placeholder="Search by username"
      />
      <SearchBar
        value={searchTag}
        onChangeText={setSearchTag}
        onSearchPress={handleCategorySearch}
        placeholder="Or, search by category"
      />

      <FlatList
        ref={flatListRef}
        data={posts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <PostCard post={item} currentUserId={currentUserId || ''} />
        )}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {showScrollTop && posts.length > 0 && (
        <TouchableOpacity
          style={feedStyles.scrollTopButton}
          onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
        >
          <Text style={feedStyles.scrollTopArrow}>↑</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
