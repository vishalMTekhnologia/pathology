import { query } from "../../utils/database.js";
import { ResponseBuilder } from "../../utils/response.js";
import { AppError } from "../../middlewares/app-error.js";

export const subCategoryService = {

  //  Create
  createSubCategory: async (data) => {

    const sql = `
      INSERT INTO tbl_sub_category (
        category_id,
        sub_category_name,
        sub_category_description,
        unit,
        normal_range_min,
        normal_range_max,
        created_at,
        created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.category_id,
      data.sub_category_name,
      data.sub_category_description ?? null,
      data.unit,
      data.normal_range_min,
      data.normal_range_max,
      data.created_at,
      data.created_by
    ];

    try {
      const result = await query(sql, values);

      return ResponseBuilder.success(
        { sub_category_id: result.insertId },
        "SubCategory created successfully"
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  },

  // Get All
  getSubCategories: async () => {

    const sql = `
      SELECT 
        sc.*,
        c.category_name
      FROM tbl_sub_category sc
      JOIN tbl_category c ON sc.category_id = c.category_id
      WHERE sc.deleted_at IS NULL
      ORDER BY sc.sub_category_id DESC
    `;

    try {
      const rows = await query(sql);

      return ResponseBuilder.success(
        rows,
        "SubCategories fetched successfully"
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  },

  // Get By ID
  getSubCategoryById: async (id) => {

    const sql = `
      SELECT 
        sc.*,
        c.category_name
      FROM tbl_sub_category sc
      JOIN tbl_category c ON sc.category_id = c.category_id
      WHERE sc.sub_category_id = ? AND sc.deleted_at IS NULL
    `;

    try {
      const rows = await query(sql, [id]);

      return ResponseBuilder.success(
        rows[0] || null,
        "SubCategory fetched successfully"
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  },

  // Update (Partial)
  updateSubCategory: async (data) => {

    const sql = `
      UPDATE tbl_sub_category
      SET
        category_id = COALESCE(?, category_id),
        sub_category_name = COALESCE(?, sub_category_name),
        sub_category_description = COALESCE(?, sub_category_description),
        unit = COALESCE(?, unit),
        normal_range_min = COALESCE(?, normal_range_min),
        normal_range_max = COALESCE(?, normal_range_max),
        status = COALESCE(?, status),
        updated_at = ?,
        updated_by = ?
      WHERE sub_category_id = ? AND deleted_at IS NULL
    `;

    const values = [
      data.category_id ?? null,
      data.sub_category_name ?? null,
      data.sub_category_description ?? null,
      data.unit ?? null,
      data.normal_range_min ?? null,
      data.normal_range_max ?? null,
      data.status ?? null,
      data.updated_at,
      data.updated_by,
      data.sub_category_id
    ];

    try {
      await query(sql, values);

      return ResponseBuilder.success(
        null,
        "SubCategory updated successfully"
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  },

  // Delete (Soft)
  deleteSubCategory: async (id, deleted_at) => {

    const sql = `
      UPDATE tbl_sub_category
      SET deleted_at = ?
      WHERE sub_category_id = ?
    `;

    try {
      await query(sql, [deleted_at, id]);

      return ResponseBuilder.success(
        null,
        "SubCategory deleted successfully"
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  }

};