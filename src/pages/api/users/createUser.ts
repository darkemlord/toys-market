/* eslint-disable import/no-extraneous-dependencies */
import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "@/utils/db/connectMongo";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUserDocument } from "@/models/userModel";

/**
 * @swagger
 * /api/users/createUser:
 *   post:
 *     tags:
 *       - Users
 *     description: Create a new user
 *     operationId: CreateUser
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User information
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - username
 *             - email
 *             - password
 *           properties:
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *     responses:
 *       200:
 *         description: Return a success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

export default async function addUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectMongo();
    const { username, password, email, role }: IUserDocument = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = { username, password: hashedPassword, email, role };
    const user = await User.create(newUser);
    const token = jwt.sign(
      { username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );
    res.json({ message: `User ${user.username} Saved Successfully`, token });
  } catch (err: any) {
    if (err.code === 11000) {
      res.json({ error: `User ${req.body.email} already exist` });
    } else {
      res.json({ error: err.message });
    }
  }
}
