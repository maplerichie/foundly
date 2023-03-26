import { NextApiRequest, NextApiResponse } from "next";
// import formidable from "formidable";
import { userDb } from "../../../helpers/polybase";
import { decryptWithAES } from "../../../helpers/crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      const { user, id } = req.body;
      const address = decryptWithAES(String(id));
      try {
        const { data, block } = await userDb.record(String(user)).get();
        res.status(200).json({ address: address });
      } catch (e: any) {
        res.status(500).json({ message: "Server error" });
      }
      break;
    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
  return;
}
