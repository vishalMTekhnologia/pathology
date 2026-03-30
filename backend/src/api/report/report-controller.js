import { AppError } from "../../middlewares/app-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { getEpochTime } from "../../utils/epoch.js";
import { reportService } from "./report-service.js";

export const reportController = {
addReport: asyncHandler(async (req, res) => {
  const {
    patient_id,
    test_id,
    sample_collected_by,
    readings,
  } = req.body;

  if (!patient_id || !test_id || !readings?.length) {
    throw new AppError("Required fields missing", 400);
  }

  const result = await reportService.addReportService({
    patient_id,
    test_id,
    sample_collected_by,
    readings,
    created_at: getEpochTime(),
    created_by: req.user?.user_id
  });

  if (!result?.report_id) {
    throw new AppError(result.message || "Failed to create report", 400);
  }

  res.status(201).json({
    success: true,
    message: result.message,
    data: {
      report_id: result.report_id,
    },
  });
}),


};
