import express from "express";
import { labController } from "./lab-controller.js";

export const labRouter = (() => {
  const router = express.Router();
router.post("/add", labController.addLab);
router.get("/", labController.getLabs);
router.patch("/update", labController.updateLab);
router.delete("/delete/:lab_id", labController.deleteLab);
// lab users
router.post("/assign-user", labController.assignLabUsers);
router.delete("/delete-user", labController.deleteLabUsers)

  return router;
})();
