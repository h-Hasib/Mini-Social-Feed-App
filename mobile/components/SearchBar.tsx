import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { styles as feedStyles } from '@/assets/styles/feed.styles';
import { COLORS } from '@/constants/colors';


export default function SearchBar() {
return (
  <View style={feedStyles.searchContainer}>
    <TextInput
      placeholder="Search user..."
      placeholderTextColor={COLORS.textLight}
      style={feedStyles.searchInput}
    />

    <TouchableOpacity style={feedStyles.searchButton}>
      <Text style={feedStyles.searchButtonText}>Search</Text>
    </TouchableOpacity>
  </View>
  );
}