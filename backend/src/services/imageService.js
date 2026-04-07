
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js"; // ✅ use the correct config

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "lostfound_reports",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // ✅ 2MB max
  }
});

