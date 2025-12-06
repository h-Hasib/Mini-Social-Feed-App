import React, { useState } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import SearchBar from "@/components/SearchBar";
import PostCard from "@/components/PostCard";
import { dummyPosts } from "@/data/dummyPosts";
import { styles as feedStyles } from "@/assets/styles/feed.styles";

export default function Feed() {
  const [posts, setPosts] = useState(dummyPosts);
  // <-- give the ref the correct instance type for FlatList
  const flatListRef = React.useRef<FlatList<any> | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const loadMorePosts = () => {
    setPosts((prev) => {
      // create new unique ids to avoid key collisions if you duplicate
      const newBatch = dummyPosts.map((p) => ({
        ...p,
        id: `${p.id}_${Math.random().toString(36).slice(2)}`,
      }));
      return [...prev, ...newBatch];
    });
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 200);
  };

  return (
    <View style={feedStyles.container}>
      <SearchBar />

      <FlatList
        ref={flatListRef}
        data={posts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => <PostCard post={item} />}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {showScrollTop && (
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
