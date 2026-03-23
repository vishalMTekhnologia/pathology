import { query } from "../../utils/database.js";
import { ResponseBuilder } from "../../utils/response.js";
import { AppError } from "../../middlewares/app-error.js";

export const testService = {

  // ✅ Create Test
  createTest: async (data) => {

    const sql = `CALL CreateTest(?,?,?,?,?,?)`;

    const values = [
      data.test_code ?? null,
      data.test_name,
      data.test_description,
      data.status ?? 1,
      data.created_at,
      data.created_by
    ];

    try {
      const [result] = await query(sql, values);

      return ResponseBuilder.success(
        result?.[0]?.[0] || null,
        "Test created successfully"
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  },

  // ✅ Get All Tests
  getTests: async () => {

    const sql = `CALL GetTests()`;

    try {
      const [rows] = await query(sql);

      return ResponseBuilder.success(
        rows[0] || [],
        "Tests fetched successfully"
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  },

  // ✅ Get By ID
  getTestById: async (test_id) => {

    const sql = `CALL GetTestById(?)`;

    try {
      const [rows] = await query(sql, [test_id]);

      return ResponseBuilder.success(
        rows[0]?.[0] || null,
        "Test fetched successfully"
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  },

  // ✅ Update Test
  updateTest: async (data) => {

    const sql = `CALL UpdateTest(?,?,?,?,?,?,?)`;

    const values = [
      data.test_id,
      data.test_code ?? null,
      data.test_name ?? null,
      data.test_description ?? null,
      data.status ?? null,
      data.updated_at,
      data.updated_by
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

  // ✅ Delete Test
  deleteTest: async (test_id, deleted_at, deleted_by) => {

    const sql = `CALL DeleteTest(?,?,?)`;

    try {
      await query(sql, [test_id, deleted_at, deleted_by]);

      return ResponseBuilder.success(
        null,
        "Test deleted successfully"
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  }

};