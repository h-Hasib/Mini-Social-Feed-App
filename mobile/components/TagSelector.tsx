import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { COLORS } from "@/constants/colors";

type TagSelectorProps = {
  tags: string[];
  selectedTag: string | null;
  onSelect: (tag: string) => void;
};

export default function TagSelector({ tags, selectedTag, onSelect }: TagSelectorProps) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", marginVertical: 12 }}>
      {tags.map((tag) => (
        <TouchableOpacity
          key={tag}
          onPress={() => onSelect(tag)}
          style={{
            backgroundColor: selectedTag === tag ? COLORS.primary : COLORS.border,
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 20,
            marginRight: 8,
            marginBottom: 8,
          }}
        >
          <Text style={{ color: selectedTag === tag ? COLORS.white : COLORS.text }}>
            {tag}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
