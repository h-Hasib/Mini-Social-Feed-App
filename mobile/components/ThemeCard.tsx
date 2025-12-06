// src/components/ThemeCard.tsx
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { ThemeCardStyles } from "@/assets/styles/profile.styles";

type ThemeObject = {
  primary: string;
  background: string;
  text: string;
  border: string;
  white: string;
  textLight: string;
  card: string;
};

export default function ThemeCard({
  themeKey,
  theme,
  active,
  onPress,
}: {
  themeKey: string;
  theme: ThemeObject;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={[ThemeCardStyles.card, active && ThemeCardStyles.cardActive]}>
      <View style={[ThemeCardStyles.swatch, { backgroundColor: theme.primary }]} />
      <View style={ThemeCardStyles.meta}>
        <Text style={ThemeCardStyles.themeName}>{themeKey}</Text>
        <Text style={ThemeCardStyles.themeSub}>Tap to select</Text>
      </View>
    </TouchableOpacity>
  );
}
