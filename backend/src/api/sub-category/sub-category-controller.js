import { AppError } from "../../middlewares/app-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { getEpochTime } from "../../utils/epoch.js";
import { subCategoryService } from "./sub-category-service.js";

export const subCategoryController = {

  // ✅ Create
  createSubCategory: asyncHandler(async (req, res) => {

    const {
      category_id,
      sub_category_name,
      sub_category_description,
      unit,
      normal_range_min,
      normal_range_max
    } = req.body;

    if (!category_id || !sub_category_name || !unit || normal_range_min == null || normal_range_max == null) {
      throw new AppError("Required fields are missing", 400);
    }

    const data = {
      category_id,
      sub_category_name,
      sub_category_description,
      unit,
      normal_range_min,
      normal_range_max,
      created_at: getEpochTime(),
      created_by: req.user?.user_id
    };

    const response = await subCategoryService.createSubCategory(data);
    res.status(response.statusCode).json(response);
  }),

  // ✅ Get All
  getSubCategories: asyncHandler(async (req, res) => {

    const response = await subCategoryService.getSubCategories();
    res.status(response.statusCode).json(response);
  }),

  // ✅ Get By ID
  getSubCategoryById: asyncHandler(async (req, res) => {

    const { sub_category_id } = req.params;

    if (!sub_category_id) {
      throw new AppError("sub_category_id is required", 400);
    }

    const response = await subCategoryService.getSubCategoryById(sub_category_id);
    res.status(response.statusCode).json(response);
  }),

  // ✅ Update
  updateSubCategory: asyncHandler(async (req, res) => {

    const { sub_category_id } = req.params;

    if (!sub_category_id) {
      throw new AppError("sub_category_id is required", 400);
    }

    const {
      category_id,
      sub_category_name,
      sub_category_description,
      unit,
      normal_range_min,
      normal_range_max,
      status
    } = req.body;

    const data = {
      sub_category_id,
      category_id,
      sub_category_name,
      sub_category_description,
      unit,
      normal_range_min,
      normal_range_max,
      status,
      updated_at: getEpochTime(),
      updated_by: req.user?.user_id
    };

    const response = await subCategoryService.updateSubCategory(data);
    res.status(response.statusCode).json(response);
  }),

  // ✅ Delete (Soft)
  deleteSubCategory: asyncHandler(async (req, res) => {

    const { sub_category_id } = req.params;

    if (!sub_category_id) {
      throw new AppError("sub_category_id is required", 400);
    }

    const response = await subCategoryService.deleteSubCategory(
      sub_category_id,
      getEpochTime()
    );

    res.status(response.statusCode).json(response);
  }),

};