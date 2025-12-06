// src/services/authService.ts
/**
 * Dummy auth service. Replace implementations with Clerk or your auth provider.
 */

export async function logout() {
  // TODO: call Clerk's signOut or your backend logout
  // Example for Clerk:
  // await signOut();
  return new Promise((res) => setTimeout(res, 300));
}

export function getCurrentUserId() {
  // For dummy data we return a fixed id. Replace with actual current user id.
  return "user-1";
}

export async function changePassword({ oldPassword, newPassword }: { oldPassword: string; newPassword: string; }) {
  // TODO: implement via your auth provider
  // This is a stub that accepts any input.
  return new Promise((res) => setTimeout(res, 400));
}
