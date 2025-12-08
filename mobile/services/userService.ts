import { api } from './authService';

export const savePushToken = async (token: string) => {
  try{
    const response = await api.post("/user/push-token", { token });
    return response.data;
  } catch (error: any) {
    console.warn("Failed to store Token", error?.response?.data || error.message);
    throw new Error("Failed to store Token");
  }
};