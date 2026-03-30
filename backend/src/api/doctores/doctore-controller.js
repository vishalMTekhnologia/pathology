import { AppError } from "../../middlewares/app-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { getEpochTime } from "../../utils/epoch.js";
import { doctorService } from "./doctore-service.js";

export const doctorController = {

  // 🔐 Role check
  checkAdmin: (req) => {
    const allowedRoles = [1, 2]; // super_admin, admin

    if (!allowedRoles.includes(req.user?.role_id)) {
      throw new AppError("Access denied. Admin only", 403);
    }
  },

  addDoctors: asyncHandler(async (req, res) => {
    doctorController.checkAdmin(req);
    const lab_id = req.user?.lab_id;

    const {
      doc_name,
      doc_address,
      doc_contact,
      doc_qaulification
    } = req.body;

    if (!lab_id || !doc_name || !doc_address || !doc_contact || !doc_qaulification) {
      throw new AppError("Required fields missing", 400);
    }

    const response = await doctorService.addDoctor({
      lab_id,
      doc_name,
      doc_address,
      doc_contact,
      doc_qaulification,
      created_at: getEpochTime(),
      created_by: req.user.user_id
    });

    res.status(response.statusCode).json(response);
  }),


  updateDoctor: asyncHandler(async (req, res) => {

    doctorController.checkAdmin(req);
 const lab_id = req.user?.lab_id;
    const {
      doc_id,
      doc_name,
      doc_address,
      doc_contact,
      doc_qaulification
    } = req.body;

    if (!doc_id) {
      throw new AppError("doc_id is required", 400);
    }

    const response = await doctorService.updateDoctor({
      doc_id,
      lab_id,
      doc_name,
      doc_address,
      doc_contact,
      doc_qaulification,
      updated_at: getEpochTime(),
      updated_by: req.user.user_id
    });

    res.status(response.statusCode).json(response);
  }),


  deleteDoctor: asyncHandler(async (req, res) => {

    doctorController.checkAdmin(req);

    const { doc_id } = req.body;

    if (!doc_id) {
      throw new AppError("doc_id is required", 400);
    }

    const response = await doctorService.deleteDoctor(
      doc_id,
      getEpochTime(),
      req.user.user_id
    );

    res.status(response.statusCode).json(response);
  }),


  getDoctors: asyncHandler(async (req, res) => {
    // const {lab_id} = req.params;
     const lab_id = req.user?.lab_id;
    doctorController.checkAdmin(req);
    const response = await doctorService.getDoctors(lab_id);
    res.status(response.statusCode).json(response);
  }),

  getDoctorById: asyncHandler(async (req, res) => {
    doctorController.checkAdmin(req);
    const { doc_id } = req.query;
    const response = await doctorService.getDoctorById(doc_id);
    res.status(response.statusCode).json(response);
  })

};