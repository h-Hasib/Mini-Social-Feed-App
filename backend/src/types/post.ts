interface Post {
  id: string;
  userId: string;
  userName: string;
  email: string;
  content: string;
  category: string | string[];
  createdAt: any;
  likes: any[];
  totalLikes: number;
  totalComments: number;
}
export default Post