import { query } from "../../utils/database.js";
import { ResponseBuilder } from "../../utils/response.js";
import { AppError } from "../../middlewares/app-error.js";

export const reportService = {
addReportService: async (data) => {
  const {
    patient_id,
    test_id,
    sample_collected_by,
    readings,
    created_at,
    created_by,
  } = data;

  const sql = `CALL AddReportWithReadings(?,?,?,?,?,?)`;

  const [rows] = await query(sql, [
    patient_id,
    test_id,
    sample_collected_by,
    created_at,
    created_by,
    JSON.stringify(readings),
  ]);

  let procRow = null;

  if (Array.isArray(rows)) {
    procRow = Array.isArray(rows[0]) ? rows[0][0] : rows[0];
  }

  if (!procRow) {
    throw new AppError("No response from database", 500);
  }

  if (!procRow.report_id) {
    throw new AppError(procRow.message || "Failed to create report", 400);
  }

  return procRow;
},



};