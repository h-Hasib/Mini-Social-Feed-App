import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Comment } from '@/services/postService';
import { COLORS } from '@/constants/colors';
import { styles as feedStyles } from '@/assets/styles/feed.styles';

interface CommentItemProps {
  comment: Comment;
}

function formatCommentDate(isoString: string) {
  const date = new Date(isoString);
  const hours = date.toLocaleString("en-US", { hour: "numeric", hour12: true });
  const minutes = date.toLocaleString("en-US", { minute: "2-digit" });
  const time = `${hours.split(" ")[0]}:${minutes} ${hours.split(" ")[1]}`;
  const day = date.toLocaleString("en-US", { day: "2-digit" });
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${time}, ${day} ${month} ${year}`;
}

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.userName}>{comment.userName}</Text>
        <Text style={feedStyles.date}>
          {comment.createdAt ? formatCommentDate(comment.createdAt) : ""}
        </Text>
      </View>
      <Text style={styles.content}>{comment.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderBottomWidth: 1,
    borderColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  date: {
    fontSize: 11,
    color: COLORS.text,
  },
  content: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
});