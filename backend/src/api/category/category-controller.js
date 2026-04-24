import { AppError } from "../../middlewares/app-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { getEpochTime } from "../../utils/epoch.js";
import { categoryService } from "./category-service.js";

export const categoryController = {

  // ✅ Create Category
  createCategory: asyncHandler(async (req, res) => {

    const created_by = req.user?.user_id;

    const {
      test_id,
      category_name,
      category_discription
    } = req.body;

    if (!test_id || !category_name || !category_discription) {
      throw new AppError("test_id, category_name and category_discription are required", 400);
    }

    const data = {
      test_id,
      category_name,
      category_discription,
      created_at: getEpochTime(),
      created_by
    };

    const response = await categoryService.createCategory(data);

    res.status(response.statusCode).json(response);
  }),

  // ✅ Get All Categories
  getCategories: asyncHandler(async (req, res) => {

    const response = await categoryService.getCategories();

    res.status(response.statusCode).json(response);
  }),

  // ✅ Get Category By ID
  getCategoryById: asyncHandler(async (req, res) => {

    const { category_id } = req.params;

    if (!category_id) {
      throw new AppError("category_id is required", 400);
    }

    const response = await categoryService.getCategoryById(category_id);

    res.status(response.statusCode).json(response);
  }),

  // ✅ Update Category
  updateCategory: asyncHandler(async (req, res) => {

    const { category_id } = req.params;

    if (!category_id) {
      throw new AppError("category_id is required", 400);
    }

    const {
      test_id,
      category_name,
      category_discription
    } = req.body;

    const data = {
      category_id,
      test_id,
      category_name,
      category_discription,
      updated_at: getEpochTime(),
      updated_by: req.user?.user_id
    };

    const response = await categoryService.updateCategory(data);

    res.status(response.statusCode).json(response);
  }),

  // ✅ Delete Category (Soft Delete)
  deleteCategory: asyncHandler(async (req, res) => {

    const { category_id } = req.params;

    if (!category_id) {
      throw new AppError("category_id is required", 400);
    }

    const response = await categoryService.deleteCategory(
      category_id,
      getEpochTime(),
      req.user?.user_id
    );

    res.status(response.statusCode).json(response);
  }),

};