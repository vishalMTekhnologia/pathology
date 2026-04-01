import { query } from "../../utils/database.js";
import { ResponseBuilder } from "../../utils/response.js";
import { AppError } from "../../middlewares/app-error.js";
import { encrypt } from "../../utils/encryption.js";
import { checkAdmins } from "../../utils/check-admin.js";

export const labService = {

  addLab: async (data) => {

    const sql = `CALL add_lab(?,?,?,?,?,?,?,?,?)`;

    const values = [
      data.lab_name,
      data.lab_address,
      data.lab_contact,
      data.lab_email,
      data.lab_social_url || null,
      data.lab_logo || null,
      data.lab_note || null,
      data.created_at,
      data.created_by
    ];

    const [result] = await query(sql, values);

    return ResponseBuilder.success(
      result[0][0],
      "Lab created successfully"
    );

  },

  updateLab: async (data) => {

    const sql = `CALL update_lab(?,?,?,?,?,?,?,?,?,?)`;
    const values = [
      data.lab_id,
      data.lab_name,
      data.lab_address,
      data.lab_contact,
      data.lab_email,
      data.lab_social_url || null,
      data.lab_logo || null,
      data.lab_note || null,
      data.updated_at,
      data.updated_by
    ];

    await query(sql, values);

    return ResponseBuilder.success(
      null,
      "Lab updated successfully"
    );

  },

  deleteLab: async (lab_id, deleted_at, deleted_by) => {
    if (!lab_id) {
      throw new AppError("lab_id is required", 400);
    }
      const result = await query(
      `
      UPDATE tbl_lab
      SET
        lab_status = '0',
        deleted_at = ?,
        deleted_by = ?
      WHERE lab_id = ?
        AND lab_status = '1'
      `,
      [deleted_at, deleted_by, lab_id],
    );
    return ResponseBuilder.success(
      null,
      "Lab deleted successfully"
    );
  },

  getLabs: async () => {
    const sql = `CALL get_labs()`;
    const [rows] = await query(sql);
    return ResponseBuilder.success( "Labs fetched successfully", rows);
  },

  getLabsByLabId : async (lab_id) => {
  try {
    if (!lab_id) {
      throw new Error("lab_id is required");
    }

    const sql = `
      SELECT *
      FROM tbl_lab
      WHERE lab_id = ? AND deleted_at IS NULL
    `;

    const rows = await query(sql, [lab_id]);

    if (rows.length === 0) {
      return ResponseBuilder.success("No lab found", []);
    }

    return ResponseBuilder.success(
      "Lab details fetched successfully",
      rows[0]   // single record
    );

  } catch (error) {
    throw error;
  }
},

    assignLabUsers: async (data) => {

    const { lab_id, user_ids, created_at, created_by } = data;

    if (!lab_id) {
      throw new AppError("lab_id is required", 400);
    }

    if (!Array.isArray(user_ids)) {
      throw new AppError("user_ids must be array", 400);
    }

    const sql = `CALL assign_lab_users(?,?,?,?)`;

    await query(sql, [
      lab_id,
      JSON.stringify(user_ids),
      created_at,
      created_by
    ]);

    return ResponseBuilder.success(
      null,
      "Lab users synced successfully"
    );

  },

    deleteLabUser: async (lab_user_id, deleted_at, deleted_by) => {

    await checkAdmins(deleted_by);

    if (!lab_user_id) {
      throw new AppError("lab_user_id is required", 400);
    }

    const sql = `CALL delete_lab_user(?,?,?)`;

    try {
      await query(sql, [
        lab_user_id,
        deleted_at,
        deleted_by
      ]);

      return ResponseBuilder.success(
        null,
        "Lab user deleted successfully"
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }

  }

};