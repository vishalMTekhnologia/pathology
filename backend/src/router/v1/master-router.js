import express from "express";
import { checkJWT } from "../../middlewares/check-jwt.js";
import { authRouter } from "../../api/auth/auth-router.js";


const router = express.Router();
router.use("/auth", authRouter);
router.use(checkJWT);

export default router;
