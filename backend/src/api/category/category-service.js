import { query } from "../../utils/database.js";
import { ResponseBuilder } from "../../utils/response.js";
import { AppError } from "../../middlewares/app-error.js";

export const categoryService = {

  // ✅ Create Category
  createCategory: async (data) => {

    const sql = `
      INSERT INTO tbl_category (
        test_id,
        category_name,
        category_discription,
        price,
        created_at,
        created_by
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.test_id,
      data.category_name,
      data.category_discription,
      data.price ?? null,
      data.created_at,
      data.created_by
    ];

    try {
      const result = await query(sql, values);

      return ResponseBuilder.success(
        { category_id: result.insertId },
        "Category created successfully"
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  },

  // ✅ Get All Categories
  getCategories: async () => {

    const sql = `
      SELECT c.*, t.test_name
      FROM tbl_category c
      JOIN tbl_test t ON c.test_id = t.test_id
      WHERE c.deleted_at IS NULL
      ORDER BY c.category_id DESC
    `;

    try {
      const rows = await query(sql);

      return ResponseBuilder.success(
        rows,
        "Categories fetched successfully"
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  },

  // ✅ Get By ID
  getCategoryById: async (category_id) => {

    const sql = `
      SELECT c.*, t.test_name
      FROM tbl_category c
      JOIN tbl_test t ON c.test_id = t.test_id
      WHERE c.category_id = ? AND c.deleted_at IS NULL
    `;

    try {
      const rows = await query(sql, [category_id]);

      return ResponseBuilder.success(
        rows[0] || null,
        "Category fetched successfully"
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  },

  // ✅ Update Category
  updateCategory: async (data) => {

    const sql = `
      UPDATE tbl_category
      SET
        test_id = COALESCE(?, test_id),
        category_name = COALESCE(?, category_name),
        category_discription = COALESCE(?, category_discription),
        price = COALESCE(?, price),
        updated_at = ?,
        updated_by = ?
      WHERE category_id = ? AND deleted_at IS NULL
    `;

    const values = [
      data.test_id ?? null,
      data.category_name ?? null,
      data.category_discription ?? null,
      data.price ?? null,
      data.updated_at,
      data.updated_by,
      data.category_id
    ];

    try {
      await query(sql, values);

      return ResponseBuilder.success(
        null,
        "Category updated successfully"
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  },

  // ✅ Delete Category
  deleteCategory: async (category_id, deleted_at, deleted_by) => {

    const sql = `
      UPDATE tbl_category
      SET
        deleted_at = ?,
        deleted_by = ?
      WHERE category_id = ?
    `;

    try {
      await query(sql, [deleted_at, deleted_by, category_id]);

      return ResponseBuilder.success(
        null,
        "Category deleted successfully"
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  }

};