import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import { Server } from "socket.io";
import session from "express-session";
import cookieParser from "cookie-parser";
import { pool } from "./src/initializers/db-connection.js";
import masterRouter from "./src/router/v1/master-router.js";
import { apiLimiter } from "./src/middlewares/rate-limiter.js";
import { errorHandler } from "./src/middlewares/error-handler.js";
import { zodErrorHandler } from "./src/middlewares/zod-error-handler.js";
import { encrypt, decrypt } from "./src/utils/encryption.js";

// -------------------- Load env --------------------
dotenv.config();

// -------------------- Initialize app --------------------
const app = express();

// -------------------- Middleware: core --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// -------------------- Session + Passport --------------------
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

// -------------------- CORS --------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://192.168.1.6:5173",
  "http://192.168.1.15:5173",
  "http://192.168.29.43:5173",
  "http://192.168.1.20:5173",
  "http://192.168.29.113:5173",
  "http://192.168.1.7:5173",
  "http://localhost:4000/",
  "http://20.244.100.159:4000",
  "http://20.244.36.151:4000/",
  "http://20.244.100.159:8000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn("CORS blocked origin:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.set("trust proxy", 1);

// -------------------- DB Connection Test --------------------
(async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    console.log("Database connected successfully");
    connection.release();
  } catch (err) {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  }
})();

// -------------------- HTTP + Socket.IO --------------------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  path: "/socket.io/",
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection_error", (err) => {
  console.error("Socket.IO connection error:", err.message, err.data);
});

// -------------------- Routes --------------------
app.use("/api/v1", apiLimiter, masterRouter);

const sample = decrypt(
  "8f64a53fbc980e63318c8f7aa754e27c0677bf1eb71f3a45a2b67385a37fc9240489bcba58c00dbbc2ba85d2dd994c5b4532628ae7f33d692e7f04edc91e0601ce9270c31d08a5e4c29e5db80d83e7e2a83708c28c9892649ac64b4f541334f7",
  process.env.STATIC_KEY,
);
// const sample = encrypt("delhi").encryptedData;
console.log(sample);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome, to Memorify School Gallery!");
});

// -------------------- Error Handlers --------------------
app.use(zodErrorHandler);
app.use(errorHandler);

// -------------------- Start Server --------------------
const PORT = process.env.APP_PORT || 7005;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Socket.IO server running on port: ${PORT}`);
  console.log(`Allowed origins:`, allowedOrigins);
});


