import { query } from "../../utils/database.js";
import { ResponseBuilder } from "../../utils/response.js";
import { AppError } from "../../middlewares/app-error.js";

export const reportService = {
// addReportService: async (data) => {
//   const {
//     patient_id,
//     test_id,
//     sample_collected_by,
//     status,
//     readings,
//     created_at,
//     created_by,
//   } = data;


//   const sql = `CALL AddReportWithReadings(?,?,?,?,?,?,?)`;

//   const values = [
//     patient_id,
//     test_id,
//     sample_collected_by,
//     status,
//     created_at,
//     created_by,
//     JSON.stringify(readings),
//   ];

//   const [rows] = await query(sql, values);
//    console.log("SP RESPONSE =>", rows);

//   if (!rows || !rows[0] || !rows[0][0]) {
//     throw new AppError("Database error while creating report", 500);
//   }

//   return rows[0][0];
// },

addReportService: async (data) => {
  const {
    patient_id,
    test_id,
    sample_collected_by,
    status,
    readings,
    created_at,
    created_by,
  } = data;

  const sql = `CALL AddReportWithReadings(?,?,?,?,?,?,?)`;

  const [rows] = await query(sql, [
    patient_id,
    test_id,
    sample_collected_by,
    status,
    created_at,
    created_by,
    JSON.stringify(readings),
  ]);

  console.log("SP RESPONSE =>", rows);

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