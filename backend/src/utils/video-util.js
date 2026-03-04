import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import os from "os";
import sharp from "sharp";
import axios from "axios";
import { spawn } from "child_process";
import ffprobePath from "@ffprobe-installer/ffprobe";

ffmpeg.setFfmpegPath(ffmpegPath.path);

// ============================================
// CONFIG: Smart Thumbnail Generation
// ============================================
const CONFIG = {
  // Timeouts
  PROBE_TIMEOUT: 10000,
  FRAME_TIMEOUT: 20000,
  TOTAL_TIMEOUT: 120000, // 2 mins max (allow for download)

  // Output
  WIDTH: 320,
  HEIGHT: 180,
  WEBP_QUALITY: 80,

  // Smart Selection
  SEEK_TIMES: [0.1, 1, 2, 3, 5], // Check first few seconds
  BLACK_THRESHOLD: 0.95,

  // Download
  PARTIAL_SIZE: 15 * 1024 * 1024, // 15MB
};

// ============================================
// UTILITY: Download Video (Partial or Full)
// ============================================
async function downloadVideo(url, destPath, range = null) {
  const writer = fs.createWriteStream(destPath);

  const config = {
    method: "get",
    url: url,
    responseType: "stream",
    timeout: 60000,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  };

  if (range) {
    config.headers = { Range: range };
  }

  try {
    const response = await axios(config);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
      response.data.on("error", reject);
    });
  } catch (err) {
    writer.close();
    if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
    throw err;
  }
}

// ============================================
// UTILITY: Get Video Duration
// ============================================
async function getVideoDuration(filePath) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (proc) proc.kill();
      reject(new Error("FFprobe timeout"));
    }, CONFIG.PROBE_TIMEOUT);

    const proc = spawn(ffmpegPath.path, ["-i", filePath, "-hide_banner"]);
    let stderr = "";

    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("close", () => {
      clearTimeout(timeout);
      const match = stderr.match(/Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})/);
      if (match) {
        const hours = parseFloat(match[1]);
        const minutes = parseFloat(match[2]);
        const seconds = parseFloat(match[3]);
        resolve(hours * 3600 + minutes * 60 + seconds);
      } else {
        resolve(0);
      }
    });
  });
}

// ============================================
// UTILITY: Check Visual Content
// ============================================
async function isVisuallyEmpty(imagePath) {
  try {
    const { data, info } = await sharp(imagePath)
      .raw()
      .toBuffer({ resolveWithObject: true });

    let darkPixels = 0;
    const total = info.width * info.height;
    const threshold = 30;

    for (let i = 0; i < data.length; i += info.channels) {
      if (
        data[i] < threshold &&
        data[i + 1] < threshold &&
        data[i + 2] < threshold
      ) {
        darkPixels++;
      }
    }
    return darkPixels / total > CONFIG.BLACK_THRESHOLD;
  } catch (e) {
    return false;
  }
}

// ============================================
// CORE: Extract Frame from Local File
// ============================================
async function extractFrameFromLocal(filePath, tempDir) {
  let duration = await getVideoDuration(filePath);
  console.log(`[Thumbnail] Local file duration: ${duration}s`);

  // If duration is 0, it might be a partial file without moov atom at start
  // But ffmpeg might still be able to read the start.

  for (const time of CONFIG.SEEK_TIMES) {
    if (duration > 0 && time > duration) continue;

    console.log(`[Thumbnail] Trying timestamp: ${time}s`);
    const framePath = path.join(tempDir, `frame-${time}.jpg`);

    try {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(
          () => reject(new Error("Timeout")),
          CONFIG.FRAME_TIMEOUT
        );

        ffmpeg(filePath)
          .seekInput(time)
          .outputOptions(["-vframes 1", "-q:v 2"])
          .output(framePath)
          .on("end", () => {
            clearTimeout(timeout);
            resolve();
          })
          .on("error", (err) => {
            clearTimeout(timeout);
            reject(err);
          })
          .run();
      });

      if (fs.existsSync(framePath)) {
        const isBad = await isVisuallyEmpty(framePath);
        if (!isBad) {
          console.log("[Thumbnail] ✅ Good frame found!");
          return await sharp(framePath)
            .resize({
              width: CONFIG.WIDTH,
              height: CONFIG.HEIGHT,
              fit: "cover",
              position: "center",
            })
            .webp({ quality: CONFIG.WEBP_QUALITY })
            .toBuffer();
        }
        fs.unlinkSync(framePath);
      }
    } catch (e) {
      console.warn(`[Thumbnail] Failed at ${time}s: ${e.message}`);
    }
  }
  return null;
}

// ============================================
// MAIN: Generate Video Thumbnail
// ============================================
export async function generateVideoThumbnail(videoUrl) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "thumb-gen-"));
  const videoPath = path.join(tempDir, "video.mp4");

  try {
    console.log("[Thumbnail] Starting generation...");

    // STRATEGY 1: Partial Download (Fast)
    try {
      console.log(
        `[Thumbnail] Attempting partial download (${
          CONFIG.PARTIAL_SIZE / 1024 / 1024
        }MB)...`
      );
      await downloadVideo(
        videoUrl,
        videoPath,
        `bytes=0-${CONFIG.PARTIAL_SIZE}`
      );

      const thumb = await extractFrameFromLocal(videoPath, tempDir);
      if (thumb) {
        cleanup(tempDir);
        return thumb;
      }
      console.warn("[Thumbnail] Partial download yielded no valid frames.");
    } catch (err) {
      console.warn(`[Thumbnail] Partial download failed: ${err.message}`);
    }

    // STRATEGY 2: Full Download (Fallback)
    console.log("[Thumbnail] Falling back to FULL download...");
    // Clear previous partial file
    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);

    await downloadVideo(videoUrl, videoPath);
    const thumb = await extractFrameFromLocal(videoPath, tempDir);

    if (thumb) {
      cleanup(tempDir);
      return thumb;
    }

    // STRATEGY 3: Last Resort Fallback (0s)
    console.warn("[Thumbnail] All smart checks failed. Trying 0s force...");
    const fallbackPath = path.join(tempDir, "force.jpg");
    await new Promise((resolve) => {
      ffmpeg(videoPath)
        .seekInput(0)
        .outputOptions(["-vframes 1", "-q:v 5"])
        .output(fallbackPath)
        .on("end", resolve)
        .on("error", resolve)
        .run();
    });

    if (fs.existsSync(fallbackPath)) {
      const buffer = await sharp(fallbackPath)
        .resize({ width: CONFIG.WIDTH, height: CONFIG.HEIGHT, fit: "cover" })
        .webp({ quality: 60 })
        .toBuffer();
      cleanup(tempDir);
      return buffer;
    }

    throw new Error("Failed to generate any thumbnail");
  } catch (err) {
    console.error(`[Thumbnail] Fatal Error: ${err.message}`);
    return createFallback();
  } finally {
    cleanup(tempDir);
  }
}

function createFallback() {
  return sharp({
    create: {
      width: CONFIG.WIDTH,
      height: CONFIG.HEIGHT,
      channels: 3,
      background: { r: 50, g: 50, b: 50 },
    },
  })
    .webp({ quality: 60 })
    .toBuffer();
}

function cleanup(dir) {
  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  } catch (e) {}
}

export function getVideoDurationFromUrl(url) {
  return new Promise((resolve) => {
    const proc = spawn(ffprobePath.path, [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      url,
    ]);

    let output = "";

    proc.stdout.on("data", (d) => {
      output += d.toString();
    });

    proc.on("close", () => {
      const duration = parseFloat(output);
      resolve(Number.isFinite(duration) ? duration : null);
    });

    proc.on("error", () => resolve(null));
  });
}
