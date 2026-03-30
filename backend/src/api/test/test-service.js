import { query } from "../../utils/database.js";
import { ResponseBuilder } from "../../utils/response.js";
import { AppError } from "../../middlewares/app-error.js";

export const testService = {

  // Create Test
  createTest: async (data) => {
    const sql = `
      INSERT INTO tbl_test (
        test_code,
        test_name,
        test_description,
        created_at,
        created_by
      ) VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      data.test_code ?? null,
      data.test_name,
      data.test_description,
      data.created_at,
      data.created_by
    ];

    try {
      const result = await query(sql, values);

      return ResponseBuilder.success(
        { test_id: result.insertId },
        "Test created successfully"
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  },

  // Get All Tests
  getTests: async () => {

    const sql = `
      SELECT *
      FROM tbl_test
      WHERE deleted_at IS NULL
      ORDER BY test_id DESC
    `;

    try {
      const rows = await query(sql);

      return ResponseBuilder.success(
        rows,
        "Tests fetched successfully"
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  },

  // Get By ID
  getTestById: async (test_id) => {

    const sql = `
      SELECT *
      FROM tbl_test
      WHERE test_id = ? AND deleted_at IS NULL
    `;

    try {
      const rows = await query(sql, [test_id]);

      return ResponseBuilder.success(
        "Test fetched successfully",rows[0] || null,
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  },

  // Update Test (Partial Update)
  updateTest: async (data) => {

    const sql = `
      UPDATE tbl_test
      SET
        test_code = COALESCE(?, test_code),
        test_name = COALESCE(?, test_name),
        test_description = COALESCE(?, test_description),
        status = COALESCE(?, status),
        updated_at = ?,
        updated_by = ?
      WHERE test_id = ? AND deleted_at IS NULL
    `;

    const values = [
      data.test_code ?? null,
      data.test_name ?? null,
      data.test_description ?? null,
      data.status ?? null,
      data.updated_at,
      data.updated_by,
      data.test_id
    ];

    try {
      await query(sql, values);

      return ResponseBuilder.success(
        null,
        "Test updated successfully"
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  },

  // Delete Test (Soft Delete)
  deleteTest: async (test_id, deleted_at, deleted_by) => {
    const sql = `
      UPDATE tbl_test
      SET
        deleted_at = ?,
        deleted_by = ?
      WHERE test_id = ?
    `;
    try {
      await query(sql, [deleted_at, deleted_by, test_id]);

      return ResponseBuilder.success(
        null,
        "Test deleted successfully"
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  }

};