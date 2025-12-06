// src/styles/profile.styles.ts
import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/colors";

export const ProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    alignItems: "center",
    marginBottom: 18,
  },
  name: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  email: {
    marginTop: 6,
    color: COLORS.textLight,
  },
  phone: {
    marginTop: 4,
    color: COLORS.textLight,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "stretch",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "700",
  },
  emptyText: {
    color: COLORS.textLight,
    textAlign: "center",
    paddingVertical: 12,
  },
});

/* Avatar styles */
export const AvatarStyles = StyleSheet.create({
  avatar: {
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    color: COLORS.white,
    fontWeight: "700",
  },
});

/* Theme card styles */
export const ThemeCardStyles = StyleSheet.create({
  card: {
    width: 130,
    height: 70,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 12,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
  },
  cardActive: {
    borderWidth: 2,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  swatch: {
    width: 34,
    height: 34,
    borderRadius: 6,
    marginRight: 10,
  },
  meta: {
    flex: 1,
  },
  themeName: {
    fontWeight: "700",
    textTransform: "capitalize",
    color: COLORS.text,
  },
  themeSub: {
    fontSize: 12,
    color: COLORS.textLight,
  },
});

/* Post item styles */
export const PostItemStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  username: {
    fontWeight: "700",
    color: COLORS.text,
  },
  date: {
    color: COLORS.textLight,
    fontSize: 12,
  },
  text: {
    color: COLORS.text,
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
  },
  actionBtn: {
    marginRight: 16,
  },
  actionText: {
    fontWeight: "700",
  },
});

/* Modal styles for change password & edit post */
export const ModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: COLORS.text,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: COLORS.text,
    backgroundColor: COLORS.card,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    minWidth: 110,
    alignItems: "center",
  },
});
