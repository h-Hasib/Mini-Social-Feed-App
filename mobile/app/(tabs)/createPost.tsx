import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { TAGS } from "@/constants/tags";
import TagSelector from "@/components/TagSelector";
import { createPostStyles } from "@/assets/styles/createPost.styles";
import * as postService from "@/services/postService";

export default function CreatePostScreen() {
  const [text, setText] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePost = async () => {
    if (!text.trim()) {
      Alert.alert("Error", "Post text cannot be empty");
      return;
    }
    if (!selectedTag) {
      Alert.alert("Error", "Please select a tag for your post");
      return;
    }

    setLoading(true);

    try {
      const newPost = {
        id: Date.now().toString(),
        username: "Anonymous",
        text: text.trim(),
        tag: selectedTag,
        date: new Date().toISOString(),
      };

      await postService.createPost(newPost);
      setText("");
      setSelectedTag(null);
      Alert.alert("Success", "Your post has been created!");
    } catch (e) {
      Alert.alert("Error", "Failed to create post");
      console.error(e);
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
      />

      <Text style={createPostStyles.tagLine}>Choose a tag for your post.</Text>
      
      <TagSelector tags={TAGS} selectedTag={selectedTag} onSelect={setSelectedTag} />

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
