import { query } from "../../utils/database.js";
import { ResponseBuilder } from "../../utils/response.js";
import { AppError } from "../../middlewares/app-error.js";

export const patientService = {

  // Create Patient
  createPatient: async (data) => {
    const sql = `CALL CreatePatient(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const values = [
      data.lab_id,
      data.patient_name,
      data.patient_address || null,
      data.patient_contact,
      data.patient_email || null,
      data.sex || null,
      data.ref_by_id || null,
      data.age,
      JSON.stringify(data.test_ids),
      data.status || 1,
      data.fees || 0,
      data.advance || 0,
      data.created_at,
      data.created_by
    ];

    try {
      const [result] = await query(sql, values);

      return ResponseBuilder.success(
        result?.[0]?.[0] || null,
        "Patient created successfully"
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  },

  // Get Patients
  getPatientsByLab: async (lab_id) => {

    const sql = `CALL GetPatientsByLab(?)`;

    try {
      const [rows] = await query(sql, [lab_id]);

      return ResponseBuilder.success(
        rows[0] || [],
        "Patients fetched successfully"
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  },

  // Update Patient
  updatePatient: async (data) => {
    const sql = `CALL UpdatePatient(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const values = [
      data.patient_id,
      data.patient_name ?? null,
      data.patient_address ?? null,
      data.patient_contact ?? null,
      data.patient_email ?? null,
      data.sex ?? null,
      data.ref_by_id ?? null,
      data.age ?? null,
      data.test_ids !== undefined ? JSON.stringify(data.test_ids) : null,
      data.status ?? null,
      data.fees ?? null,
      data.advance ?? null,
      data.updated_at,
      data.updated_by
    ];

    try {
      await query(sql, values);

      return ResponseBuilder.success(
        null,
        "Patient updated successfully"
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  },
  // Delete Patient
  deletePatient: async (patient_id, deleted_at, deleted_by) => {

    const sql = `CALL DeletePatient(?,?,?)`;

    try {
      await query(sql, [patient_id, deleted_at, deleted_by]);

      return ResponseBuilder.success(
        null,
        "Patient deleted successfully"
      );

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  }

};