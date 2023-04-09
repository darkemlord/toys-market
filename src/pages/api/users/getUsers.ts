/* eslint-disable import/no-extraneous-dependencies */
import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "@/utils/db/connectMongo";
import User, { IUserDocument } from "@/models/userModel";
import isAuthenticated from "@/utils/middleware/authentication";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    connectMongo();
    const allUsers: IUserDocument[] = await User.find({}, { password: 0 });
    res.json(allUsers);
  } catch (err: any) {
    res.json({ error: err });
  }
}

export default isAuthenticated(handler);
