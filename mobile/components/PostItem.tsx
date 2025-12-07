// src/components/PostItem.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { PostItemStyles } from "@/assets/styles/profile.styles";
import { COLORS } from "@/constants/colors";


function formatDate(isoString: string) {
  const date = new Date(isoString);

  const hours = date.toLocaleString("en-US", { hour: "numeric", hour12: true });
  const minutes = date.toLocaleString("en-US", { minute: "2-digit" });
  const time = `${hours.split(" ")[0]}:${minutes}${hours.split(" ")[1]}`; 
  // Example: "5:55PM"

  const day = date.toLocaleString("en-US", { day: "2-digit" });
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${time}, ${day} ${month} ${year}`;
}

export default function PostItem({ post, onEdit, onDelete }: { post: any; onEdit: () => void; onDelete: () => void; }) {
  return (
    <View style={PostItemStyles.container}>
      <View style={PostItemStyles.header}>
        <Text style={PostItemStyles.username}>{post.userName}</Text>
        <Text style={PostItemStyles.date}>{formatDate(post.createdAt)}</Text>
      </View>

      <Text style={PostItemStyles.text}>{post.content}</Text>

      <View style={{
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10
      }}>
        <View style={PostItemStyles.actions}>
          <TouchableOpacity onPress={onEdit} style={PostItemStyles.actionBtn}>
            <Text style={[PostItemStyles.actionText, { color: COLORS.primary }]}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete} style={PostItemStyles.actionBtn}>
            <Text style={[PostItemStyles.actionText, { color: "#ff4d4d" }]}>Delete</Text>
          </TouchableOpacity>
        </View>
        <View style={PostItemStyles.actionRow}>
          <TouchableOpacity style={PostItemStyles.actionGroup}>
            <Text style={PostItemStyles.countText}>{post?.totalLikes}</Text>
            <Text style={PostItemStyles.actionEmoji}>👍</Text>
          </TouchableOpacity>

          <TouchableOpacity style={PostItemStyles.actionGroup}>
            <Text style={PostItemStyles.countText}>{post?.totalComments || 0}</Text>
            <Text style={PostItemStyles.actionEmoji}>💬</Text>
          </TouchableOpacity>
      </View>

      </View>
    </View>
  );
}
