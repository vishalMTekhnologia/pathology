import multer from "multer";
import path from "path";

// Supported extensions
const allowedImageTypes = [".jpg", ".jpeg", ".png", ".gif", ".tif", ".tiff", ".svg", ".bmp", ".raw"];
const allowedVideoTypes = [".mp4", ".mov", ".wmv", ".avi", ".avchd", ".flv", ".f4v", ".swf"];

const storage = multer.memoryStorage(); // Use memory for Azure upload

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isAllowed = [...allowedImageTypes, ...allowedVideoTypes].includes(ext);
  if (!isAllowed) {
    return cb(new Error("Only image and video files are allowed"), false);
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // max 100MB per file
});
