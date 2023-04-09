/* eslint-disable import/no-extraneous-dependencies */
import jwt from "jsonwebtoken";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const isAuthenticated =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    // Get token from the authorization header
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    try {
      // Verify token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
      req.body = { user: decodedToken };
      return handler(req, res);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };

export default isAuthenticated;
