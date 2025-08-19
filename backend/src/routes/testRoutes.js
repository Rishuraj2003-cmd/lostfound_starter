import express from "express";
import { upload } from "../services/imageService.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

export async function testUpload(req, res) {
  try {
    const file = req.file?.path || "https://upload.wikimedia.org/wikipedia/commons/a/a3/June_odd-eyed-cat_cropped.jpg";
    const result = await cloudinary.uploader.upload(file, { folder: "lostfound" });

    res.json({ message: "Upload success ✅", url: result.secure_url });
  } catch (err) {
    console.error("Cloudinary error ❌", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
}

router.post("/test-upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({
    message: "Upload successful ✅",
    url: req.file.path,   // Cloudinary gives us the secure URL
  });
});

export default router;
