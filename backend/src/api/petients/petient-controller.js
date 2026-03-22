import { AppError } from "../../middlewares/app-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { getEpochTime } from "../../utils/epoch.js";
import { patientService } from "./petient-service.js";

export const patientController = {

  // ✅ Create Patient
  createPatient: asyncHandler(async (req, res) => {
    const lab_id = req.user?.lab_id;
    const created_by = req.user?.user_id;
    const {
      patient_name,
      patient_address,
      patient_contact,
      patient_email,
      sex,
      ref_by_id,
      age,
      test_ids,
      status,
      fees,
      advance,
    } = req.body;

    if (!lab_id || !patient_name || !patient_contact || !age || !test_ids) {
      throw new AppError("Required fields are missing", 400);
    }

    const data = {
      lab_id,
      patient_name,
      patient_address,
      patient_contact,
      patient_email,
      sex,
      ref_by_id,
      age,
      test_ids,
      status,
      fees,
      advance,
      created_at: getEpochTime(),
      created_by
    };

    const response = await patientService.createPatient(data);

    res.status(response.statusCode).json(response);
  }),

  // ✅ Get Patients
  getPatientsByLab: asyncHandler(async (req, res) => {

    const lab_id = req.user?.lab_id;

    if (!lab_id) {
      throw new AppError("Lab ID is required", 400);
    }

    const response = await patientService.getPatientsByLab(lab_id);

    res.status(response.statusCode).json(response);
  }),

  // ✅ Update Patient
 updatePatient: asyncHandler(async (req, res) => {

  const {
    patient_id,
    patient_name,
    patient_address,
    patient_contact,
    patient_email,
    sex,
    ref_by_id,
    age,
    test_ids,
    status,
    fees,
    advance,
  } = req.body;

  if (!patient_id) {
    throw new AppError("patient_id is required", 400);
  }

  // ✅ validate only if provided
  if (test_ids && (!Array.isArray(test_ids) || test_ids.length === 0)) {
    throw new AppError("test_ids must be non-empty array", 400);
  }

  const data = {
    patient_id,
    patient_name,
    patient_address,
    patient_contact,
    patient_email,
    sex,
    ref_by_id,
    age,
    test_ids,
    status,
    fees,
    advance,
    updated_at: getEpochTime(),
    updated_by: req.user?.user_id
  };

  const response = await patientService.updatePatient(data);

  res.status(response.statusCode).json(response);
}),

  // ✅ Delete Patient
  deletePatient: asyncHandler(async (req, res) => {

    const { patient_id } = req.params;

    if (!patient_id) {
      throw new AppError("patient_id is required", 400);
    }

    const response = await patientService.deletePatient(
      patient_id,
      getEpochTime(),
      req.user?.user_id
    );

    res.status(response.statusCode).json(response);
  }),

};