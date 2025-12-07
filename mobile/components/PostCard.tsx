import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles as feedStyles } from '@/assets/styles/feed.styles';
import { COLORS } from '@/constants/colors';
import { Post } from '@/services/postService';

interface PostCardProps {
  post: Post;
}

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

export default function PostCard({post}: PostCardProps) {
  return (
    <View style={feedStyles.card}>
      <View style={feedStyles.cardHeader}>
        <View style={feedStyles.leftBlock}>
          <Text style={feedStyles.username}>{post.userName}</Text>
          <Text style={feedStyles.date}>{formatDate(post.createdAt)}</Text>
        </View>
        <View style={feedStyles.headerRight}>
          {Array.isArray(post.category) ? (
            post.category.map((cat, index) => (
              <View key={index} style={feedStyles.tag}>
                <Text style={feedStyles.tagText}>{cat}</Text>
              </View>
            ))
          ) : (
            <View style={feedStyles.tag}>
              <Text style={feedStyles.tagText}>{post.category}</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={feedStyles.postText}>{post.content}</Text>

      <View style={feedStyles.actionRow}>
        <TouchableOpacity style={feedStyles.actionGroup}>
          <Text style={feedStyles.countText}>{post?.totalLikes}</Text>
          <Text style={feedStyles.actionEmoji}>👍</Text>
          <Text style={feedStyles.actionText}>Like</Text>
        </TouchableOpacity>

        <TouchableOpacity style={feedStyles.actionGroup}>
          <Text style={feedStyles.countText}>{post?.totalComments || 0}</Text>
          <Text style={feedStyles.actionEmoji}>💬</Text>
          <Text style={feedStyles.actionText}>Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}