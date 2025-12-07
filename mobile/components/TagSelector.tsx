import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { COLORS } from "@/constants/colors";

type TagSelectorProps = {
  tags: string[];
  selectedTags: string[];
  onSelect: (tags: string[]) => void;
  maxSelection?: number;
};

export default function TagSelector({
  tags,
  selectedTags,
  onSelect,
  maxSelection = 3,
}: TagSelectorProps) {
  const toggleTag = (tag: string) => {
    const isSelected = selectedTags.includes(tag);

    if (isSelected) {
      // Remove tag
      onSelect(selectedTags.filter((t) => t !== tag));
    } else {
      // Add tag if under max selection
      if (selectedTags.length >= maxSelection) return;
      onSelect([...selectedTags, tag]);
    }
  };

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", marginVertical: 12 }}>
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <TouchableOpacity
            key={tag}
            onPress={() => toggleTag(tag)}
            style={{
              backgroundColor: isSelected ? COLORS.primary : COLORS.border,
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 20,
              marginRight: 8,
              marginBottom: 8,
            }}
          >
            <Text style={{ color: isSelected ? COLORS.white : COLORS.text }}>
              {tag}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
