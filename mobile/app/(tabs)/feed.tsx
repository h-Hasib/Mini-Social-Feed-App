import React, { useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, Text, Alert, ActivityIndicator } from "react-native";
import SearchBar from "@/components/SearchBar";
import PostCard from "@/components/PostCard";
import { dummyPosts } from "@/data/dummyPosts";
import { styles as feedStyles } from "@/assets/styles/feed.styles";
import { getAllPosts, Post } from "../../services/postService"
import { COLORS } from "@/constants/colors";
import { getPostsByUser } from "../../services/postService";
import { getCurrentUser } from "@/services/authService";

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = React.useRef<FlatList<any> | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
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
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to refresh posts");
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      fetchPosts();
      return;
    }
    setLoading(true);
    try {
      const data = await getPostsByUser(searchText.trim());
      console.log("first", )
      setPosts(data);
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
        value={searchText}
        onChangeText={(text: string) => setSearchText(text)}
        onSearchPress={handleSearch}
      />

      <FlatList
        ref={flatListRef}
        data={posts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => <PostCard post={item} />}
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
