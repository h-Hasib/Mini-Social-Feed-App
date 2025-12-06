// src/components/PostItem.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { PostItemStyles } from "@/assets/styles/profile.styles";
import { COLORS } from "@/constants/colors";

export default function PostItem({ post, onEdit, onDelete }: { post: any; onEdit: () => void; onDelete: () => void; }) {
  return (
    <View style={PostItemStyles.container}>
      <View style={PostItemStyles.header}>
        <Text style={PostItemStyles.username}>{post.username}</Text>
        <Text style={PostItemStyles.date}>{post.date}</Text>
      </View>

      <Text style={PostItemStyles.text}>{post.text}</Text>

      <View style={PostItemStyles.actions}>
        <TouchableOpacity onPress={onEdit} style={PostItemStyles.actionBtn}>
          <Text style={[PostItemStyles.actionText, { color: COLORS.primary }]}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onDelete} style={PostItemStyles.actionBtn}>
          <Text style={[PostItemStyles.actionText, { color: "#ff4d4d" }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
