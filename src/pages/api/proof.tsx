import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { sendNotification } from "../../helpers/push";
import { decryptWithAES } from "../../helpers/crypto";
import { uploadImage } from "../../helpers/imagekit";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const form = new formidable.IncomingForm({
    keepExtensions: true,
    uploadDir: "./temp/",
    allowEmptyFiles: false,
    maxFiles: 1,
    maxFileSize: 2.5 * 1024 * 1024,
  });

  form.parse(req, async (error: any, fields: any, files: any) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
      return;
    }
    const { itemId, owner, proofId } = fields;

    const dataError = !files ? "Please upload image" : null;
    if (dataError) {
      res.status(422).json({ message: error });
    }

    const image = fs.readFileSync(files.image.filepath);
    const uploadStatus = await uploadImage(
      image.toString("base64"),
      "/proofs/",
      proofId
    );
    if (!uploadStatus) {
      res.status(422).json({ message: error });
    } else {
      const to = decryptWithAES(String(owner));
      await sendNotification(
        "You have a new proof!",
        "New Proof",
        "You have a new proof!",
        to
      );
      fs.unlinkSync(files.image.filepath);
      res.status(201).json({ message: "Proof created!" });
    }
  });
  return;
}
