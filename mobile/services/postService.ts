import { api } from './authService';

// Post type
export interface Post {
  id: string;
  userId: string;
  userName: string;
  email: string;
  content: string;
  category: string | string[];
  likes: string[];
  createdAt: string;
  totalLikes?: number;
  totalComments?: number;
}

export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get('/post/'); // GET /post
    return response.data;
  } catch (error: any) {
    console.warn('Failed to fetch posts:', error?.response?.data || error.message);
    throw new Error('Failed to fetch posts');
  }
};

export const createPost = async (content: string, category: string[]) => {
  try {
    const response = await api.post('/post/', {
      content,
      category,
    });

    return response.data;
  } catch (error: any) {
    console.warn("Failed to create post:", error?.response?.data || error.message);
    throw new Error("Failed to create post");
  }
};

export const getPostsByUser = async (userId: string) => {
  try {
    const response = await api.get(`/post/user/id/${userId}`);
    return response.data;
  } catch (error: any) {
    console.warn("Failed to fetch user posts:", error?.response?.data || error.message);
    throw new Error("Failed to fetch user posts");
  }
};

export const updatePost = async (postId: string, data: { content: string; category: string[] }) => {
  try {
    const response = await api.put(`/post/${postId}`, data);
    return response.data;
  } catch (error: any) {
    console.warn("Failed to update post:", error?.response?.data || error.message);
    throw new Error("Failed to update post");
  }
};

export const deletePost = async (postId: string) => {
  try {
    const response = await api.delete(`/post/${postId}`);
    return response.data;
  } catch (error: any) {
    console.warn("Failed to delete post:", error?.response?.data || error.message);
    throw new Error("Failed to delete post");
  }
};