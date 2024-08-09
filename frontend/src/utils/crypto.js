import CryptoJS from "crypto-js";

const SECRET = process.env.REACT_APP_SECRET_KEY;

export function encrypt(plainText = "") {
    const b64 = CryptoJS.AES.encrypt(plainText.toString(), "test").toString();
    const e64 = CryptoJS.enc.Base64.parse(b64);
    const eHex = e64.toString(CryptoJS.enc.Hex);
    return eHex.toString();
}

export function decrypt(cipherText) {
    const reb64 = CryptoJS.enc.Hex.parse(cipherText.toString());
    const bytes = reb64.toString(CryptoJS.enc.Base64);
    const decrypt = CryptoJS.AES.decrypt(bytes, "test");
    const plain = decrypt.toString(CryptoJS.enc.Utf8);
    return plain;
}