// src/context/AuthContext.tsx
import React, { createContext, useContext } from "react";
import * as authService from "@/services/authService";

/**
 * This is a very small auth context used by the Profile screen.
 * Replace or expand according to your actual auth (Clerk) integration.
 */

type AuthContextType = {
  userId: string;
  user?: { name: string; email: string; phone?: string }; // add this
  logout: () => Promise<void>;
  login?: () => Promise<void>;
};
const AuthContext = createContext<AuthContextType>({
  userId: "user-1",
  logout: async () => {},
});

export const AuthProvider = ({ children }: any) => {
  const userId = authService.getCurrentUserId(); // dummy or real
  const logout = async () => {
    await authService.logout();
  };

  return <AuthContext.Provider value={{ userId, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
