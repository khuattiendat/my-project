import CryptoJS from "crypto-js";
const SECRET = process.env.REACT_APP_SECRET_KEY;
export function encrypt(plainText) {
    var b64 = CryptoJS.AES.encrypt(plainText.toString(), "test").toString();
    var e64 = CryptoJS.enc.Base64.parse(b64);
    var eHex = e64.toString(CryptoJS.enc.Hex);
    return eHex.toString();
}

export function decrypt(cipherText) {
    var reb64 = CryptoJS.enc.Hex.parse(cipherText.toString());
    var bytes = reb64.toString(CryptoJS.enc.Base64);
    var decrypt = CryptoJS.AES.decrypt(bytes, "test");
    var plain = decrypt.toString(CryptoJS.enc.Utf8);
    return plain;
}