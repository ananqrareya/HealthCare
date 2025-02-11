import CryptoJS from "crypto-js";

// مفتاح سري ثابت داخل الكود
const secretKey = "a_strong_and_unique_secret_key_1234!";

// وظيفة لتشفير البيانات
export const encryptData = (data) => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
};

// وظيفة لفك تشفير البيانات
export const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};
