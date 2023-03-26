import { prepareWriteAttestation, writeAttestation } from "@eth-optimism/atst";
import { NextApiRequest, NextApiResponse } from "next";
import { decryptWithAES } from "../../helpers/crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      const { ownerId, finderAddress } = req.body;
      const ownerAddress = decryptWithAES(String(ownerId));
      try {
        const preparedTx = await prepareWriteAttestation(
          "0x00000000000000000000000000000000000060A7", // about
          "animalfarm.school.GPA", // key
          "3.25" // value
        );

        // const txReq = preparedTx.request
        const tx = await writeAttestation(preparedTx);
        const rcpt = await tx.wait();
        console.log(`Attestation written:`);
        console.log(
          `https://goerli-explorer.optimism.io/tx/${rcpt.transactionHash}`
        );
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
