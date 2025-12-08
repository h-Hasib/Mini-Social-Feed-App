import React from "react";
import { View, Text } from "react-native";
import { AvatarStyles } from "@/assets/styles/profile.styles";
import { COLORS } from "@/constants/colors";

type Props = {
  name: string;
  size?: number;
};

export default function UserAvatar({ name, size = 72 }: Props) {
  const initials = (name || "U").split(" ").map((s) => s[0]).slice(0, 2).join("");
  return (
    <View style={[AvatarStyles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[AvatarStyles.initials, { fontSize: Math.round(size / 2.8) }]}>{initials}</Text>
    </View>
  );
}
