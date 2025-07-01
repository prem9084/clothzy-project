import {v2 as cloudinary} from "cloudinary"
import fs from "fs";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;

export const uploadImage = async (localeFilePath) => {
    try {
    if (!localeFilePath) return null;
    const result = await cloudinary.uploader.upload(localeFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localeFilePath);
    return result;
  } catch (error) {
    fs.unlinkSync(localeFilePath); 
    return null // Delete the file if upload fails
  }
};