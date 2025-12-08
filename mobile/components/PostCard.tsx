import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { styles as feedStyles } from '@/assets/styles/feed.styles';
import { COLORS } from '@/constants/colors';
import { Post, toggleLikePost } from '@/services/postService';
import CommentModal from './CommentModal';

interface PostCardProps {
  post: Post;
  currentUserId: string;
  onLikeUpdate?: () => void;
}

function formatDate(isoString: string) {
  const date = new Date(isoString);
  const hours = date.toLocaleString("en-US", { hour: "numeric", hour12: true });
  const minutes = date.toLocaleString("en-US", { minute: "2-digit" });
  const time = `${hours.split(" ")[0]}:${minutes}${hours.split(" ")[1]}`;
  const day = date.toLocaleString("en-US", { day: "2-digit" });
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${time}, ${day} ${month} ${year}`;
}

export default function PostCard({ post, currentUserId, onLikeUpdate }: PostCardProps) {
  const [likes, setLikes] = useState(post.totalLikes || 0);
  const [likedByMe, setLikedByMe] = useState(post?.likes?.includes(currentUserId) || false);
  const [commentCount, setCommentCount] = useState(post?.totalComments || 0);
  const [showCommentModal, setShowCommentModal] = useState(false);

  useEffect(() => {
    setLikes(post.totalLikes || 0);
    setLikedByMe(post?.likes?.includes(currentUserId) || false);
    setCommentCount(post?.totalComments || 0);
  }, [post, currentUserId]);

  const handleLikeToggle = async () => {
    if (!currentUserId) {
      Alert.alert("Error", "Please login to like posts");
      return;
    }

    const newLikedState = !likedByMe;
    setLikedByMe(newLikedState);
    setLikes((prev) => prev + (newLikedState ? 1 : -1));

    try {
      const response = await toggleLikePost(post.id);
      
      if (response?.totalLikes !== undefined) {
        setLikes(response.totalLikes);
      }

      if (onLikeUpdate) {
        onLikeUpdate();
      }
    } catch (error: any) {
      setLikedByMe(!newLikedState);
      setLikes((prev) => prev + (newLikedState ? -1 : 1));
      Alert.alert("Error", error.message || "Failed to like/unlike post");
    }
  };
  const handleCommentPress = () => {
    if (!currentUserId) {
      Alert.alert("Error", "Please login to comment");
      return;
    }
    setShowCommentModal(true);
  };

  const handleCommentAdded = () => {
    setCommentCount((prev) => prev + 1);
    if (onLikeUpdate) {
      onLikeUpdate();
    }
  };

  return (
    <>
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
          <TouchableOpacity style={feedStyles.actionGroup} onPress={handleLikeToggle}>
            <Text style={feedStyles.countText}>{likes}</Text>
            <Text style={feedStyles.actionEmoji}>{likedByMe ? '💖' : '👍'}</Text>
            <Text style={feedStyles.actionText}>{likedByMe ? 'Unlike' : 'Like'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={feedStyles.actionGroup} onPress={handleCommentPress}>
            <Text style={feedStyles.countText}>{commentCount}</Text>
            <Text style={feedStyles.actionEmoji}>💬</Text>
            <Text style={feedStyles.actionText}>Comment</Text>
          </TouchableOpacity>
        </View>
      </View>

      <CommentModal
        visible={showCommentModal}
        postId={post.id}
        onClose={() => setShowCommentModal(false)}
        initialCommentCount={commentCount}
        onCommentAdded={handleCommentAdded}
      />
    </>
  );
}