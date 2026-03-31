import express from "express";
import { testController } from "./test-controller.js"

export const testRouter = (() => {
  const router = express.Router();
router.post("/add", testController.createTest);
router.get("/get", testController.getTests);
router.get("/get-by-id/:test_id", testController.getTestById);
router.get("/get-test-with-category/:test_id", testController.getTestsWithCategories);
router.patch("/update/:test_id", testController.updateTest);
router.delete("/delete/:test_id", testController.deleteTest);

 return router;
})();
