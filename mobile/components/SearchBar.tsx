import React from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { styles as feedStyles } from "@/assets/styles/feed.styles";
import { COLORS } from "@/constants/colors";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearchPress: () => Promise<void>;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, onSearchPress, placeholder }) => {
  return (
    <View style={feedStyles.searchContainer}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        style={feedStyles.searchInput}
        value={value}
        onChangeText={onChangeText}
        clearTextOnFocus={false}
      />

      <TouchableOpacity style={feedStyles.searchButton} onPress={onSearchPress}>
        <Text style={feedStyles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;