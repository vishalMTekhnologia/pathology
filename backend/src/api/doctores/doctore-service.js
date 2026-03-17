import { query } from "../../utils/database.js";
import { ResponseBuilder } from "../../utils/response.js";
import { AppError } from "../../middlewares/app-error.js";

export const doctorService = {

  addDoctor: async (data) => {

    const sql = `CALL add_doctor(?,?,?,?,?,?,?)`;

    const [result] = await query(sql, [
      data.lab_id,
      data.doc_name,
      data.doc_address,
      data.doc_contact,
      data.doc_qaulification,
      data.created_at,
      data.created_by
    ]);

    return ResponseBuilder.success(
      result[0][0],
      "Doctor added successfully"
    );
  },


  updateDoctor: async (data) => {

    const sql = `CALL update_doctor(?,?,?,?,?,?,?,?)`;

    await query(sql, [
      data.doc_id,
      data.lab_id,
      data.doc_name,
      data.doc_address,
      data.doc_contact,
      data.doc_qaulification,
      data.updated_at,
      data.updated_by
    ]);

    return ResponseBuilder.success(null, "Doctor updated successfully");
  },


  deleteDoctor: async (doc_id, deleted_at, deleted_by) => {

    if (!doc_id) {
      throw new AppError("doc_id is required", 400);
    }

    const sql = `CALL sp_delete_doctor(?,?,?)`;

    await query(sql, [
      doc_id,
      deleted_at,
      deleted_by
    ]);

    return ResponseBuilder.success(null, "Doctor deleted successfully");
  },


  getDoctors: async (lab_id) => {

    const sql = `CALL get_doctors(?)`;

    const [rows] = await query(sql, [lab_id]);

    return ResponseBuilder.success(rows[0], "Doctors fetched successfully");
  },


  getDoctorById: async (doc_id) => {

    if (!doc_id) {
      throw new AppError("doc_id is required", 400);
    }

    const sql = `CALL sp_get_doctor_by_id(?)`;

    const [rows] = await query(sql, [doc_id]);

    return ResponseBuilder.success(rows[0][0], "Doctor fetched successfully");
  }

};