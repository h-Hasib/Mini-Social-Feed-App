import { Request, Response } from "express";
import { db } from "../app";


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


export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Make sure user is updating their own profile
    if (req.user?.userId !== id) {
      return res.status(403).json({ error: "You can only update your own profile" });
    }

    const { userName, theme } = req.body;
    const updateData: { userName?: string; theme?: string } = {};

    if (userName) updateData.userName = userName;
    if (theme) updateData.theme = theme;

    const collection = db.collection("users");
    await collection.doc(id).update(updateData);

    res.json({ msg: "User updated successfully", updatedFields: updateData });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};


export const savePushToken = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const { token } = req.body;
    console.log("*********************************")
    if (!token) return res.status(400).json({ error: "Token missing" });

    await db.collection("users").doc(userId).update({
      expoPushToken: token,
    });

    res.json({ msg: "Token saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};