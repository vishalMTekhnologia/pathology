import express from "express";
import {subCategoryController} from "./sub-category-controller.js"

export const subCategoryRouter = (() => {
  const router = express.Router();
router.post("/add", subCategoryController.createSubCategory);
router.get("/get", subCategoryController.getSubCategories);
router.get("/get-by-id/:sub_category_id", subCategoryController.getSubCategoryById);
router.patch("/update/:sub_category_id", subCategoryController.updateSubCategory);
router.delete("/delete/:sub_category_id", subCategoryController.deleteSubCategory);

  return router;
})();
