import express from "express";
import { checkJWT } from "../../middlewares/check-jwt.js";
import { authRouter } from "../../api/auth/auth-router.js";
import { labRouter } from "../../api/lab/lab-router.js";
import { doctoreRouter } from "../../api/doctores/doctore-router.js";

const router = express.Router();
router.use("/auth", authRouter);

router.use(checkJWT);
router.use("/lab", labRouter);
router.use("/doctore", doctoreRouter);


export default router;
