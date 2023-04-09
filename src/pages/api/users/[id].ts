/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "@/utils/db/connectMongo";
import bcrypt from "bcrypt";
import User, { IUserDocument } from "@/models/userModel";

// Update the logic once the App is running
async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectMongo();
    const { id } = req.query;
    const { password } = req.body as IUserDocument;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.findByIdAndUpdate(id, {
      password: hashedPassword,
    });
    if (!user) return res.json({ error: "can't find the user" });
    res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    res.json({ err });
  }
}

async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    await User.findByIdAndDelete(id);
    res.send({
      message: "User deleted successfully",
    });
  } catch (err) {
    res.json({ error: err });
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    updateUser(req, res);
  } else if (req.method === "DELETE") {
    deleteUser(req, res);
  }
}
