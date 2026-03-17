import CryptoJS from "crypto-js";
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;
const STATIC_KEY = import.meta.env.VITE_STATIC_KEY;
export const decryptField = (encryptedHex) => {
    if (!encryptedHex || typeof encryptedHex !== "string") return encryptedHex;
    if (encryptedHex.length < 32 || !/^[a-f0-9]+$/i.test(encryptedHex)) return encryptedHex;
    try {
        const key = CryptoJS.enc.Hex.parse(ENCRYPTION_KEY);
        const iv = CryptoJS.enc.Hex.parse(STATIC_KEY);
        const ciphertext = CryptoJS.enc.Hex.parse(encryptedHex);
        const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext });
        const decrypted = CryptoJS.AES.decrypt(cipherParams, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        const result = decrypted.toString(CryptoJS.enc.Utf8);
        return result || encryptedHex;
    } catch (err) { console.warn("Decryption failed for:", encryptedHex, err); return encryptedHex; }
};
export const decryptUserProfile = (user) => {
    if (!user) return user;
    return { ...user, full_name: decryptField(user.full_name), user_email: decryptField(user.user_email), contact_no: decryptField(user.contact_no), address: decryptField(user.address) };
};
