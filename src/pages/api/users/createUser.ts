/* eslint-disable import/no-extraneous-dependencies */
import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "@/utils/db/connectMongo";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUserDocument } from "@/models/userModel";

export default async function addUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectMongo();
    const { username, password, email } = req.body as IUserDocument;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = { username, password: hashedPassword, email };
    const user = await User.create(newUser);
    const token = jwt.sign(
      { username: user.username, email: user.email },
      process.env.SECRET as string,
      { expiresIn: "24h" }
    );
    res.json({ message: `User ${user.username} Saved Successfully`, token });
  } catch (err: any) {
    if (err.code === 11000) {
      res.json({ error: `User ${req.body.email} already exist` });
    } else {
      res.json({ error: err });
    }
  }
}