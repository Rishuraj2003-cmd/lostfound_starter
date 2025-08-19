// src/services/imageService.js


/*
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "lostfound_reports", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

export const upload = multer({ storage });
*/
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

export const upload = multer({ storage });
