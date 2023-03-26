import { NextApiRequest, NextApiResponse } from "next";
// import formidable from "formidable";
import { userDb } from "../../../helpers/polybase";
import { encryptWithAES, decryptWithAES } from "../../../helpers/crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const { address } = req.query;
      const userId = encryptWithAES(String(address));
      try {
        const { data, block } = await userDb.record(userId).get();
        if ("name" in data) {
          res.status(200).json({ message: "Welcome", id: userId });
        } else {
          res.status(201).json({ redirect: true, id: userId });
        }
      } catch (e: any) {
        if ("reason" in e && e.reason == "record/not-found") {
          const createUser = await userDb.create([userId]);
          console.log("Create user success:", address, createUser);
          res.status(201).json({ redirect: true, id: userId });
        } else {
          console.error("Server error:", address, e.reason);
          res.status(500).json({ message: "Server error" });
        }
      }
      break;
    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
  return;
}
