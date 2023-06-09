/* eslint-disable import/no-useless-path-segments */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

/**
 * @swagger
 * /api/hello:
 *   get:
 *     tags:
 *       - Greetings
 *     description: Returns the hello world
 *     responses:
 *       200:
 *         description: hello world
 */

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: "John Doe" });
}
