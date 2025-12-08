import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { TAGS } from "@/constants/tags";
import TagSelector from "@/components/TagSelector";
import { createPostStyles } from "@/assets/styles/createPost.styles";
import * as postService from "@/services/postService";
import { useRouter } from 'expo-router'

export default function CreatePostScreen() {
  const router = useRouter()
  const [text, setText] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePost = async () => {
    if (!text.trim()) {
      Alert.alert("Error", "Post text cannot be empty");
      return;
    }

    if (selectedTags.length < 1) {
      Alert.alert("Error", "Select at least one category");
      return;
    }

    if (selectedTags.length > 3) {
      Alert.alert("Error", "You can select a maximum of 3 categories");
      return;
    }

    try {
      setLoading(true);
      const result = await postService.createPost(text, selectedTags);
      
      // Then show alert after a small delay
      Alert.alert("Success", "Post created successfully!");
      // Reset
      setText("");
      setSelectedTags([]);
      router.back()
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={createPostStyles.container}>
      <Text style={createPostStyles.heading}>What's on your mind?</Text>

      <TextInput
        placeholder="Write your post..."
        placeholderTextColor="#999"
        multiline
        numberOfLines={4}
        value={text}
        onChangeText={setText}
        style={createPostStyles.textInput}
        maxLength={200}
      />

      <Text style={createPostStyles.tagLine}>Choose up to 3 categories.</Text>
      
      <TagSelector
        tags={TAGS}
        selectedTags={selectedTags}
        onSelect={setSelectedTags}
        maxSelection={3}
      />

      <TouchableOpacity
        onPress={handlePost}
        style={createPostStyles.postButton}
        disabled={loading}
      >
        <Text style={createPostStyles.postButtonText}>
          {loading ? "Posting..." : "Post"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
