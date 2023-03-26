const crypto = require("crypto");

const passphrase = process.env.PASSPHRASE ?? "OppQGiqwS8Z5rP1V";
const iv = Buffer.from(process.env.IV ?? "P282H33jvSTa2Jhw");

export const encryptWithAES = (text: string) => {
  const cipher = crypto.createCipheriv("aes-128-cbc", passphrase, iv);
  const encrypted = cipher.update(text, "utf8", "hex") + cipher.final("hex");
  return encrypted;
};

export const decryptWithAES = (encrypted: string) => {
  const decipher = crypto.createDecipheriv("aes-128-cbc", passphrase, iv);
  const text =
    decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
  return text;
};
