/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "@/utils/db/connectMongo";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User, { IUserDocument, UserRole } from "@/models/userModel";
import isAuthenticated from "@/utils/middleware/authentication";

async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectMongo();
    const { id } = req.query;
    const { password }: IUserDocument = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.findByIdAndUpdate(id, {
      password: hashedPassword,
    });
    if (!user) {
      return res.json({ error: "Can't find the user" });
    }
    return res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    res.json({ err });
  }
}

async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.headers.authorization;
    const { id: userToDeleteId } = req.query;

    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);

      let role: string;
      let adminId: string;
      if (typeof decodedToken === "string") {
        role = decodedToken;
        adminId = decodedToken;
      } else {
        role = decodedToken.role;
        adminId = decodedToken.id;
      }

      if (role === UserRole.Admin && userToDeleteId !== adminId) {
        await User.findByIdAndDelete(userToDeleteId);
        res.send({
          message: "User deleted successfully",
        });
      } else {
        res.send({ message: "You don't have the necessary permissions." });
      }
    }
  } catch (err) {
    res.json({ error: err });
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    await updateUser(req, res);
  } else if (req.method === "DELETE") {
    await deleteUser(req, res);
  } else {
    res.status(405).send({ error: "Method Not Allowed" });
  }
}

export default isAuthenticated(handler);
