import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  
  // Search Bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    // height: 20
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginLeft: 8,
    borderRadius: 10,
  },
  searchButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  // Post Card
  card: {
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  leftBlock: {
    flexDirection: "column",
  },

  headerRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    flexShrink: 1,
    flexDirection: "row",
  },

  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 6,
  },

  tag: {
    backgroundColor: COLORS.border,
    paddingHorizontal: 9,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 5,
  },

  tagText: {
    fontSize: 11,
    color: COLORS.text,
    fontWeight: "500",
  },
  
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  
  email: {
    fontSize: 15,
    color: COLORS.textLight,
  },

  date: {
    fontSize: 9,
    color: COLORS.textLight,
    marginTop: 2,
  },

  postText: {
    fontSize: 18,
    color: COLORS.text,
    marginVertical: 10,
  },

  // Actions
  actionRow: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  actionGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4, 
  },

  countText: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
  },

  actionEmoji: {
    fontSize: 16,
    marginLeft: 4,
  },

  actionButton: {
    marginRight: 20,
  },

  actionText: {
    fontSize: 14,
    marginLeft: 4,
    color: COLORS.primary,
  },

  //Scroll to Top
  scrollTopButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: COLORS.primary,
    width: 55,
    height: 55,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  scrollTopArrow: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: "bold",
  },
});