import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles as feedStyles } from '@/assets/styles/feed.styles';
import { COLORS } from '@/constants/colors';


export default function PostCard({ post } : any) {
  return (
    <View style={feedStyles.card}>
      <View style={feedStyles.cardHeader}>
        <Text style={feedStyles.username}>{post.username}</Text>
        <Text style={feedStyles.email}>{post.email}</Text>
        <Text style={feedStyles.date}>{post.date}</Text>
      </View>

      <Text style={feedStyles.postText}>{post.text}</Text>

      <View style={feedStyles.actionRow}>
        <TouchableOpacity style={feedStyles.actionButton}>
          <Text style={feedStyles.actionText}>👍 Like</Text>
        </TouchableOpacity>

        <TouchableOpacity style={feedStyles.actionButton}>
          <Text style={feedStyles.actionText}>💬 Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}