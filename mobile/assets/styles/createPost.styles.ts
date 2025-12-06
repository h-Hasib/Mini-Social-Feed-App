import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/colors";

export const createPostStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
    paddingTop: 50
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  tagLine:{
    marginTop: 20,
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
  },
  textInput: {
    backgroundColor: COLORS.card,
    padding: 12,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    minHeight: 100,
    textAlignVertical: "top",
  },
  postButton: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  postButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});
