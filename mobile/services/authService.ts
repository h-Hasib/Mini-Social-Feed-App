// app/services/auth.services.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://mini-social-feed-app.vercel.app';

// const API_BASE_URL = 'http://localhost:5000';

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request if available
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login payload
interface LoginPayload {
  email: string;
  password: string;
}

// Response type
interface LoginResponse {
  message: string;
  accessToken: string;
  sessionId: string;
  user: {
    id: string;
    email: string;
    userName: string;
  };
}
interface signupPayload {
  email: string;
  password: string;
  userName: string;
}
interface signupResponse {
  message: string;
  accessToken: string;
  sessionId: string;
  user: {
    id: string;
    email: string;
    userName: string;
  };
}

export const signupUser = async (payload: signupPayload): Promise<signupResponse> => {
  try {
    const response = await api.post('/auth/signup', payload);
    
    // Save token & user in AsyncStorage
    await AsyncStorage.setItem('accessToken', response.data.accessToken);
    await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Something went wrong. Please try again.');
    }
  }
};

// Login function
export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await api.post('/auth/login', payload);
    
    // Save token & user in AsyncStorage
    await AsyncStorage.setItem('accessToken', response.data.accessToken);
    await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Something went wrong. Please try again.');
    }
  }
};


export const logoutUser = async () => {
  try {
    // Call backend logout endpoint
    await api.post('/auth/logout', {}); // payload is empty

    // Clear AsyncStorage
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('user');
  } catch (error: any) {
    console.warn('Logout failed', error?.response?.data || error.message);
    // Still clear AsyncStorage to prevent stuck session
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('user');
  }
};

export const getCurrentUser = async () => {
  try {
    const userJson = await AsyncStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};


// Export api for other authenticated requests
export { api };
