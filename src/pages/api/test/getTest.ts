import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "@/utils/db/connectMongo";
import Test from "@/models/testModel";

export default async function getTest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectMongo();
    const test = await Test.find();
    res.status(200).json({ test });
  } catch (err) {
    res.json({ err });
  }
}
