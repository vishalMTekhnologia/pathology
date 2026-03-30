import express from "express";
import {userController} from "./user-controller.js"

export const userRouter = (() => {
  const router = express.Router();
router.post("/register-lab-user", userController.registerLabUser)

router.get("/get-technician", userController.getLabTechnicians)

router.get("/get-blood-boys", userController.getBloodCollectionBoy)
  return router;
})();
