/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "@/utils/db/connectMongo";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUserDocument } from "@/models/userModel";

export default async function loginUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectMongo();
    const { email, password }: IUserDocument = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: "email or password are invalid",
      });
    }
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return res.status(401).send({
        error: "email or password are invalid",
      });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET as string
    );
    res.json({ token });
  } catch (err: any) {
    res.json({ error: err.message });
  }
}
