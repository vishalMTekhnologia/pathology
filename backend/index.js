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
  "http://192.168.1.29:5173",
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
  "e338881760aa52813ce84abb3e3813eea9b808b13a24e90a89c1f9ba3d23b31290b532d6560ea4aa12f510fe1379e56a3b3c07fcf9879f122b24139d266109b6a04ac173bf6aad16d965845b991b35a56770a6614c8608f0ba9d9e8df50f87ae",
  process.env.STATIC_KEY,
);
// const sample = encrypt("delhi").encryptedData;
console.log(sample);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome, to Pathology Lab!");
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




