import express from "express";
import { checkJWT } from "../../middlewares/check-jwt.js";
import { authRouter } from "../../api/auth/auth-router.js";
import { labRouter } from "../../api/lab/lab-router.js";
import { doctoreRouter } from "../../api/doctores/doctore-router.js";
import { petientRouter } from "../../api/petients/petient-router.js";
import { userRouter } from "../../api/users/user-router.js";
import { testRouter } from "../../api/test/test-router.js";
import { categoryRouter } from "../../api/category/category-router.js";
import { subCategoryRouter } from "../../api/sub-category/sub-category-router.js";

const router = express.Router();
router.use("/auth", authRouter);

router.use(checkJWT);
router.use("/users", userRouter)
router.use("/lab", labRouter);
router.use("/doctore", doctoreRouter);
router.use("/petient", petientRouter);
router.use("/test", testRouter);
router.use("/category", categoryRouter)
router.use("/sub-category", subCategoryRouter)

export default router;
