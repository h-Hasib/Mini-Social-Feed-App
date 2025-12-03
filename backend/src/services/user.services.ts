import { Request, Response } from "express";
import { db } from "../app";

// CREATE
export const createUser = async (req: Request, res: Response) => {
  try {
    const collection = db.collection("users");
    const docRef = await collection.add(req.body);
    res.status(201).json({ id: docRef.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// READ ALL
export const getUsers = async (_: Request, res: Response) => {
  try {
    const collection = db.collection("users");
    const snapshot = await collection.get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// READ ONE
export const getUser = async (req: Request, res: Response) => {
  try {
    const collection = db.collection("users");
    const doc = await collection.doc(req.params.id).get();
    doc.exists
      ? res.json({ id: doc.id, ...doc.data() })
      : res.status(404).json({ msg: "User not found" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// UPDATE
export const updateUser = async (req: Request, res: Response) => {
  try {
    const collection = db.collection("users");
    await collection.doc(req.params.id).update(req.body);
    res.json({ msg: "User updated" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// DELETE
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const collection = db.collection("users");
    await collection.doc(req.params.id).delete();
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};