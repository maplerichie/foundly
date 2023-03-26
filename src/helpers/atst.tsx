import { utils, BigNumber } from "ethers";
import { Address, getContract, getProvider } from "@wagmi/core";
import { ATST_ABI, ATST_ADDR } from "../constants";

export type WagmiBytes = `0x${string}`;
export const createKey = (rawKey: string): WagmiBytes => {
  if (rawKey.length < 32) {
    return utils.formatBytes32String(rawKey) as WagmiBytes;
  }
  const hash = utils.keccak256(utils.toUtf8Bytes(rawKey));
  return (hash.slice(0, 64) + "ff") as WagmiBytes;
};

export const createValue = (
  bytes: WagmiBytes | string | Address | number | boolean | BigNumber
): WagmiBytes => {
  bytes = bytes === "0x" ? "0x0" : bytes;
  if (BigNumber.isBigNumber(bytes)) {
    return bytes.toHexString() as WagmiBytes;
  }
  if (typeof bytes === "number") {
    return BigNumber.from(bytes).toHexString() as WagmiBytes;
  }
  if (typeof bytes === "boolean") {
    return bytes ? "0x1" : "0x0";
  }
  if (utils.isAddress(bytes)) {
    return bytes;
  }
  if (utils.isHexString(bytes)) {
    return bytes as WagmiBytes;
  }
  if (typeof bytes === "string") {
    return utils.hexlify(utils.toUtf8Bytes(bytes)) as WagmiBytes;
  }
  throw new Error(`unrecognized bytes type ${bytes satisfies never}`);
};

export const attestationStation = getContract({
  address: ATST_ADDR,
  abi: ATST_ABI,
  signerOrProvider: getProvider(),
});
