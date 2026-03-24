import express from "express";
import { categoryController } from "./category-controller.js"

export const categoryRouter = (() => {
  const router = express.Router();
router.post("/add", categoryController.createCategory);
router.get("/get", categoryController.getCategories);
router.get("/get-by-id/:category_id", categoryController.getCategoryById);
router.patch("/update/:category_id", categoryController.updateCategory);
router.delete("/delete/:category_id", categoryController.deleteCategory);

 return router;
})();
