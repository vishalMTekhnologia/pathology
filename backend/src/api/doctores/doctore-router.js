import express from "express";
import { doctorController } from "./doctore-controller.js";

export const doctoreRouter = (() => {
  const router = express.Router();
router.post("/add", doctorController.addDoctors);
router.put("/update", doctorController.updateDoctor);
router.get("/get-doctore-by-lab-wise", doctorController.getDoctors);
// hhhhhhhhhhhhhhhhhhh
  return router;
})();
