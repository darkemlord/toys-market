import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "@/utils/db/connectMongo";
import Test from "@/models/testModel";

export default async function addTest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectMongo();
    const test = await Test.create(req.body);
    res.json({ test });
  } catch (err) {
    res.json({ err });
  }
}
