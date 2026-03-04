import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import { BlobServiceClient } from "@azure/storage-blob";
import { getEpochTime } from "../utils/epoch.js";
import mime from "mime-types";
import { AppError } from "./app-error.js";
import { generateImageThumbnail } from "../utils/image-util.js";

dotenv.config();

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

// ============================================
// MULTER CONFIGURATION
// ============================================
export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (!file.originalname) {
      return cb(new AppError("Invalid file name.", 400));
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;

    // Validate file fields
    if (
      [
        "circlePhoto",
        "userPhoto",
        "eventCoverImage",
        "excelFile",
        "firmLogo",
        "branchLogo",
      ].includes(file.fieldname)
    ) {
      // Image files validation
      if (
        file.fieldname === "circlePhoto" ||
        file.fieldname === "userPhoto" ||
        file.fieldname === "eventCoverImage" ||
        file.fieldname === "firmLogo" ||
        file.fieldname === "branchLogo"
      ) {
        const allowedExt = /\.(jpeg|jpg|png|webp|avif)$/i;
        const mimeOk = /image\/(jpeg|jpg|png|webp|avif)/i.test(mimeType);
        if (allowedExt.test(ext) && mimeOk) {
          return cb(null, true);
        } else {
          return cb(
            new AppError(
              "Only JPEG, JPG, WEBP, AVIF and PNG files are allowed for photos.",
              400,
            ),
          );
        }
      }

      // Excel files validation
      if (file.fieldname === "excelFile") {
        const allowedExt = /\.(xls|xlsx)$/i;
        const mimeOk =
          mimeType ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          mimeType === "application/vnd.ms-excel";
        if (allowedExt.test(ext) && mimeOk) {
          return cb(null, true);
        } else {
          return cb(
            new AppError(
              "Only Excel files (.xls, .xlsx) are allowed for excelFile.",
              400,
            ),
          );
        }
      }
    } else {
      return cb(null, false);
    }
  },
});

// ============================================
// ERROR HANDLER
// ============================================
export const multerErrorHandler = (err, req, res, next) => {
  console.log("multerErrorHandler - Error:", err);
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        status: false,
        message: `File too large. Maximum size allowed is ${
          MAX_FILE_SIZE / (1024 * 1024)
        }MB.`,
      });
    }
  } else if (err) {
    return res.status(400).json({ status: false, message: err.message });
  }
  next();
};

// ============================================
// HELPER FUNCTIONS
// ============================================
const getRandomNumber = () => Math.floor(1000 + Math.random() * 9000);

// ============================================
// PHOTO UPLOAD (User/Circle Photos)
// ============================================
export const photoToAzureBlob = async (file, folder) => {
  try {
    const connStr = process.env.AZURE_CONNECTION_STRING;
    const containerName = process.env.USER_PHOTO_THUMBNAIL_CONTAINER;

    const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    await containerClient.createIfNotExists({ access: "container" });

    const epochTime = getEpochTime();
    const randomNum = getRandomNumber();

    const prefixMap = {
      userPhoto: "UP",
      circlePhoto: "GP",
      eventCoverImage: "ECI",
      firmLogo: "FL",
      branchLogo: "BL"
    };
    
    const baseName = prefixMap[file.fieldname] || "File";

    const blobName = `${folder}/${baseName}_${randomNum}_${epochTime}.webp`;

    // Use shared generateImageThumbnail function
    const thumbnailBuffer = await generateImageThumbnail(file.buffer);

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(thumbnailBuffer, {
      blobHTTPHeaders: { blobContentType: "image/webp" },
    });

    return blockBlobClient.url;
  } catch (err) {
    console.error("Azure Blob Upload Error:", err);
    throw new AppError(
      "Failed to upload profile thumbnail to Azure Blob Storage.",
      500,
    );
  }
};
