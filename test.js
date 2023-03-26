const crypto = require('crypto');


const passphrase = "OppQGiqwS8Z5rP1V";
const iv = Buffer.from("P282H33jvSTa2Jhw");

const message = [
    "0x4A80192aE73672106b45feDE304E996a3B24C290",
    "0x233469FEbCa5604010E7c216f424634cb637d828",
    "0x514eD55d46db9D2735FD7113139ea8Eb39E47bC5",
    "0x1D061573BF590D347cCAecd490e9A7Dc403e1dEc",
    "0xB81849f2AeA00774BD10411E41090b7C3faB0B84",
];


for (let i = 0; i < 5; i++) {
    const cipher = crypto.createCipheriv('aes-128-cbc', passphrase, iv);
    const encrypted = cipher.update(message[i], 'utf8', 'hex') + cipher.final('hex');

    const decipher = crypto.createDecipheriv('aes-128-cbc', passphrase, iv);
    const decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');

    console.log(encrypted, decrypted);
}
