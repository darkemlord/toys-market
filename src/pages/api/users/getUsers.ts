/* eslint-disable import/no-extraneous-dependencies */
import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "@/utils/db/connectMongo";
import User, { IUserDocument } from "@/models/userModel";
import isAuthenticated from "@/utils/middleware/authentication";

/**
 * @swagger
 * /api/users/getUsers:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns the user list
 *     responses:
 *       200:
 *         description: user list
 */

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
