import express from "express";
import { reportController } from "./report-controller.js"

export const reportRouter = (() => {
  const router = express.Router();
router.post("/add", reportController.addReport);

   return router;
})();