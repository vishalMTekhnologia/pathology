import express from "express";
import { testController } from "./test-controller.js"

export const testRouter = (() => {
  const router = express.Router();
router.post("/tests", testController.createTest);
router.get("/tests", testController.getTests);
router.get("/tests/:test_id", testController.getTestById);
router.patch("/tests/:test_id", testController.updateTest);
router.delete("/tests/:test_id", testController.deleteTest);

 return router;
})();
