import { Request, Response } from "express";
import { db } from "../app";
import Post from "../types/post";
import { Expo } from "expo-server-sdk";

const expo = new Expo();

// CREATE POST
export const createPost = async (req: Request, res: Response) => {
  try {
    const { content, category } = req.body;
    const { userId, userName, email } = req.user!;

    if (!content) return res.status(400).json({ error: "Post content is required" });

    const newPost = {
      userId,
      userName,
      email,
      content,
      category: category || "general",
      createdAt: new Date().toISOString(),
      likes: []
    };

    const docRef = await db.collection("posts").add(newPost);
    res.status(201).json({ id: docRef.id, ...newPost });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};


// READ ALL POSTS (NEWEST FIRST)
export const getPosts = async (_: Request, res: Response) => {
  try {
    const snapshot = await db.collection("posts").orderBy("createdAt", "desc").get();
    const posts = await Promise.all(snapshot.docs.map(async (doc) => {
      const data = doc.data();
      const postId = doc.id;
      const commentsSnapshot = await db.collection("comments")
                                        .where("postId", "==", postId)
                                        .orderBy("createdAt", "asc")
                                        .get();

      return {
        id: postId,
        ...data,
        totalLikes: Array.isArray(data.likes) ? data.likes.length : 0,
        totalComments: commentsSnapshot.size,
      };
    }));

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};


// READ ONE POST
export const getPostById = async (req: Request, res: Response) => {
  try {
    const collection = db.collection("posts");
    const doc = await collection.doc(req.params.id).get();

    doc.exists
      ? res.json({ id: doc.id, ...doc.data() })
      : res.status(404).json({ msg: "Post not found" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getPostsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params; 
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const lower = category.toLowerCase();

    // Fetch all posts from Firestore
    const snapshot = await db.collection("posts").get();
    const posts: Post[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Post, "id">),
    }));


    // Filter logic supports string & array
    const filtered = posts.filter(post => {
      const cat = post.category;

      if (!cat) return false;

      // Case-insensitive
      if (Array.isArray(cat)) {
        return cat.some(c => c.toLowerCase() === lower);
      }

      if (typeof cat === "string") {
        return cat.toLowerCase() === lower;
      }

      return false;
    });

    return res.json(filtered);

  } catch (error) {
    console.error("Error filtering posts:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getPostsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    // Query posts by userId, newest first
    const snapshot = await db
      .collection("posts")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    // Map posts and get total comments per post
    const posts = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const commentsSnapshot = await db
          .collection("comments")
          .where("postId", "==", doc.id)
          .get();

        return {
          id: doc.id,
          ...data,
          totalLikes: data.likes?.length || 0,
          totalComments: commentsSnapshot.size,
        };
      })
    );

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch posts for user" });
  }
};

export const getPostsByUserName = async (req: Request, res: Response) => {
  try {
    const { userName } = req.params;
    
    if (!userName) {
      return res.status(400).json({ error: "userName is required" });
    }

    // Fetch posts where userName matches
    const snapshot = await db
      .collection("posts")
      .where("userName", "==", userName)
      .get();
    
    // Build posts with totalLikes & totalComments
    const posts = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        
        // fetch comments for this post
        const commentsSnapshot = await db
          .collection("comments")
          .where("postId", "==", doc.id)
          .get();

        return {
          id: doc.id,
          ...data,
          totalLikes: data.likes?.length || 0,
          totalComments: commentsSnapshot.size,
        };
      })
    );
    
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts by userName:", err);
    res.status(500).json({ error: "Failed to fetch posts for userName" });
  }
};


// UPDATE POST
export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const collection = db.collection("posts");
    const doc = await collection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Post not found" });
    }

    const postData = doc.data();
    if (postData?.userId !== req.user?.userId) {
      return res.status(403).json({ error: "You are not allowed to update this post" });
    }

    await collection.doc(id).update(req.body);
    res.json({ msg: "Post updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update post" });
  }
};


export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const collection = db.collection("posts");
    const doc = await collection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Post not found" });
    }

    const postData = doc.data();
    if (postData?.userId !== req.user?.userId) {
      return res.status(403).json({ error: "You are not allowed to delete this post" });
    }

    await collection.doc(id).delete();
    res.json({ msg: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete post" });
  }
};


// export const likePost = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { userId } = req.user!;

//     const postRef = db.collection("posts").doc(id);
//     const doc = await postRef.get();
//     if (!doc.exists) return res.status(404).json({ error: "Post not found" });

//     const likes: string[] = doc.data()?.likes || [];
//     if (!likes.includes(userId)) likes.push(userId);
//     else likes.splice(likes.indexOf(userId), 1); // unlike

//     await postRef.update({ likes });
//     res.json({ msg: "Post like updated", totalLikes: likes.length });
//   } catch (err) {
//     res.status(500).json({ error: err });
//   }
// };
// export const likePost = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { userId, userName } = req.user!;

//     const postRef = db.collection("posts").doc(id);
//     const doc = await postRef.get();
//     if (!doc.exists) return res.status(404).json({ error: "Post not found" });

//     const post = doc.data();
//     const likes: string[] = post?.likes || [];
//     const postOwnerId = post?.userId;

//     // Like/unlike logic
//     const alreadyLiked = likes.includes(userId);
//     if (!alreadyLiked) likes.push(userId);
//     else likes.splice(likes.indexOf(userId), 1);

//     await postRef.update({ likes });

//     // Avoid notifying yourself
//     if (userId !== postOwnerId && !alreadyLiked) {
//       const userDoc = await db.collection("users").doc(postOwnerId).get();
//       const token = userDoc.data()?.expoPushToken;

//       if (token && Expo.isExpoPushToken(token)) {
//         await expo.sendPushNotificationsAsync([
//           {
//             to: token,
//             title: "New Like ❤️",
//             body: `${userName} liked your post`,
//             data: { postId: id },
//           },
//         ]);
//       }
//     }

//     res.json({ msg: "Post like updated", totalLikes: likes.length });
//   } catch (err) {
//     res.status(500).json({ error: err });
//   }
// };


export const likePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, userName } = req.user!;

    const postRef = db.collection('posts').doc(id);
    const doc = await postRef.get();
    if (!doc.exists) return res.status(404).json({ error: 'Post not found' });

    const likes: string[] = doc.data()?.likes || [];
    const creatorId = doc.data()?.userId;

    if (!likes.includes(userId)) likes.push(userId);
    else likes.splice(likes.indexOf(userId), 1); // unlike

    await postRef.update({ likes });
    res.json({ msg: 'Post like updated', totalLikes: likes.length });

    // ✅ Send push notification to post creator (skip if liker is creator)
    // if (creatorId !== userId) {
      const creatorDoc = await db.collection('users').doc(creatorId).get();
      const pushToken = creatorDoc.data()?.expoPushToken;

      if (pushToken && Expo.isExpoPushToken(pushToken)) {
        const message = {
          to: pushToken,
          sound: 'default',
          title: "New Like ❤️!",
          body: `${userName} liked your post.`,
          data: { postId: id },
        };
        await expo.sendPushNotificationsAsync([message]);
      }
    // }

  } catch (err) {
    res.status(500).json({ error: err });
  }
};



// export const commentPost = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;  // postId
//     const { content } = req.body;
//     const { userId, userName, email } = req.user!;

//     if (!content) return res.status(400).json({ error: "Comment content is required" });

//     const newComment = {
//       postId: id,
//       userId,
//       userName,
//       email,
//       content,
//       createdAt: new Date().toISOString()
//     };

//     const docRef = await db.collection("comments").add(newComment);
//     res.status(201).json({ id: docRef.id, ...newComment });
//   } catch (err) {
//     res.status(500).json({ error: err });
//   }
// };

// export const commentPost = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { content } = req.body;
//     const { userId, userName } = req.user!;

//     if (!content)
//       return res.status(400).json({ error: "Comment content is required" });

//     // Get postOwnerId
//     const postRef = db.collection("posts").doc(id);
//     const postSnap = await postRef.get();
    
//     if (!postSnap.exists)
//       return res.status(404).json({ error: "Post not found" });

//     const postOwnerId = postSnap.data()?.userId;

//     const newComment = {
//       postId: id,
//       userId,
//       userName,
//       content,
//       createdAt: new Date().toISOString(),
//     };

//     const docRef = await db.collection("comments").add(newComment);

//     // Notify ONLY if commenter is not the post creator
//     if (userId !== postOwnerId) {
//       const userDoc = await db.collection("users").doc(postOwnerId).get();
//       const token = userDoc.data()?.expoPushToken;

//       if (token && Expo.isExpoPushToken(token)) {
//         await expo.sendPushNotificationsAsync([
//           {
//             to: token,
//             title: "New Comment 💬",
//             body: `${userName} commented on your post`,
//             data: { postId: id },
//           },
//         ]);
//       }
//     }

//     res.status(201).json({ id: docRef.id, ...newComment });
//   } catch (err) {
//     res.status(500).json({ error: err });
//   }
// };


export const commentPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // postId
    const { content } = req.body;
    const { userId, userName } = req.user!;

    if (!content) return res.status(400).json({ error: 'Comment content is required' });

    const newComment = {
      postId: id,
      userId,
      userName,
      content,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('comments').add(newComment);
    res.status(201).json({ id: docRef.id, ...newComment });

    // ✅ Send push notification to post creator
    const postDoc = await db.collection('posts').doc(id).get();
    const creatorId = postDoc.data()?.userId;

    // if (creatorId !== userId) {
      const creatorDoc = await db.collection('users').doc(creatorId).get();
      const pushToken = creatorDoc.data()?.expoPushToken;

      if (pushToken && Expo.isExpoPushToken(pushToken)) {
        const message = {
          to: pushToken,
          sound: 'default',
          title: "New Comment 💬",
          body: `${userName} commented: ${content}`,
          data: { postId: id },
        };
        await expo.sendPushNotificationsAsync([message]);
      }
    // }

  } catch (err) {
    res.status(500).json({ error: err });
  }
};




export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // postId
    const snapshot = await db.collection("comments")
                             .where("postId", "==", id)
                             .orderBy("createdAt", "asc")
                             .get();

    const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
