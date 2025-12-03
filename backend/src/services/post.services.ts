import { Request, Response } from "express";
import { db } from "../app";

// CREATE POST
export const createPost = async (req: Request, res: Response) => {
  try {
    const collection = db.collection("posts");

    if (!req.body.content) {
      return res.status(400).json({ error: "Post content is required" });
    }

    const newPost = {
      content: req.body.content,
      createdAt: new Date().toISOString()
    };

    const docRef = await collection.add(newPost);
    res.status(201).json({ id: docRef.id, ...newPost });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// READ ALL POSTS (NEWEST FIRST)
export const getPosts = async (_: Request, res: Response) => {
  try {
    const collection = db.collection("posts");
    const snapshot = await collection.orderBy("createdAt", "desc").get();

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(data);
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

// UPDATE POST
export const updatePost = async (req: Request, res: Response) => {
  try {
    const collection = db.collection("posts");
    await collection.doc(req.params.id).update(req.body);
    res.json({ msg: "Post updated" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// DELETE POST
export const deletePost = async (req: Request, res: Response) => {
  try {
    const collection = db.collection("posts");
    await collection.doc(req.params.id).delete();
    res.json({ msg: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
