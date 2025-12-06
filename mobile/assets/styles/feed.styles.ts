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
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
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
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  email: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  date: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  postText: {
    fontSize: 16,
    color: COLORS.text,
    marginVertical: 10,
  },


  // Actions
  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  actionButton: {
    marginRight: 20,
  },
  actionText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
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