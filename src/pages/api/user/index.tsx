import { NextApiRequest, NextApiResponse } from "next";
// import formidable from "formidable";
import { userDb } from "../../../helpers/polybase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
  return;
}
