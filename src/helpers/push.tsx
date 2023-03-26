import * as PushAPI from "@pushprotocol/restapi";
import { Wallet } from "ethers";
import { ENV } from "../constants";

const PK = process.env.PRIVATE_KEY;

export const sendNotification = async (
  nBody: string,
  pTitle: string,
  pBody: string,
  to: string
) => {
  try {
    const pushSigner = new Wallet(PK || "");

    const apiResponse = await PushAPI.payloads.sendNotification({
      signer: pushSigner,
      type: 3, // broadcast
      identityType: 2, // direct payload
      notification: {
        title: ``,
        body: nBody,
      },
      payload: {
        title: pTitle,
        body: pBody,
        cta: "",
        img: "",
      },
      recipients: [`eip155:5:${to}`],
      channel: "eip155:5:0x1576E5438dC297d1923F142f1eF95B137bC8FE8A",
      env: ENV.STAGING,
    });
    return apiResponse;
  } catch (err) {
    console.error("Error: ", err);
  }
};
