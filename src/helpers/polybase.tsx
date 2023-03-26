import { Polybase } from "@polybase/client";
import { ethPersonalSign } from "@polybase/eth";
import {
  aescbc,
  decodeFromString,
  encodeToString,
  EncryptedDataAesCbc256,
} from "@polybase/util";

const key = decodeFromString(
  process.env.ENCRYPTION_KEY ?? "hellowoorld",
  "utf8"
);

export async function symmmetricEncryptString(str: string): Promise<any> {
  const strDataToBeEncrypted = decodeFromString(str, "utf8");
  const encryptedData = await aescbc.symmetricEncrypt(
    key,
    strDataToBeEncrypted
  );
  try {
    return {
      nonce: encodeToString(encryptedData.nonce, "hex"),
      ciphertext: encodeToString(encryptedData.ciphertext, "hex"),
    };
  } catch (err) {
    console.log(err);
    return {};
  }
}

export async function symmetricDecryptString(
  nonce: string,
  ciphertext: string
): Promise<string> {
  const strData = await aescbc.symmetricDecrypt(key, {
    version: "aes-cbc-256/symmetric",
    nonce: decodeFromString(nonce, "hex"),
    ciphertext: decodeFromString(ciphertext, "hex"),
  });
  const str = encodeToString(strData, "utf8");

  return str;
}

const namespace =
  "pk/0xd6e3e92d63e82f2bd33960a842c7804eafa73e0be38d5e0b79e0f8a96919c657a62c3687af5fa824afdc4b3da80c3df38c64de5c473f82bf8eb80090a06483a4/testnet";
// const namespace = "pk/0xd6e3e92d63e82f2bd33960a842c7804eafa73e0be38d5e0b79e0f8a96919c657a62c3687af5fa824afdc4b3da80c3df38c64de5c473f82bf8eb80090a06483a4/Foundly"

export const db = new Polybase({
  defaultNamespace: namespace,
  signer: (data) => {
    return {
      h: "eth-personal-sign",
      sig: ethPersonalSign(`0x${process.env.POLYBASE_PK}`, data),
    };
  },
});

export const lostDb = db.collection("Lost");

export const foundDb = db.collection("Found");

export const userDb = db.collection("User");

export const publicDb = new Polybase({
  defaultNamespace: namespace,
});

export const publicUser = publicDb.collection("User");

export const publicLost = publicDb.collection("Lost");

export const publicFound = publicDb.collection("Found");
