import { AppError } from "../../middlewares/app-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { getEpochTime } from "../../utils/epoch.js";
import { labService } from "./lab-service.js";

export const labController = {

  addLab: asyncHandler(async (req, res) => {

    const {
      lab_name,
      lab_address,
      lab_contact,
      lab_email,
      lab_social_url,
      lab_logo,
      lab_note
    } = req.body;

    if (!lab_name || !lab_address || !lab_contact || !lab_email) {
      throw new AppError("Required fields missing", 400);
    }

    const data = {
      lab_name,
      lab_address,
      lab_contact,
      lab_email,
      lab_social_url,
      lab_logo,
      lab_note,
      created_at: getEpochTime(),
      created_by: req.user?.user_id
    };

    const response = await labService.addLab(data);

    res.status(response.statusCode).json(response);

  }),

  updateLab: asyncHandler(async (req, res) => {

    const {
      lab_id,
      lab_name,
      lab_address,
      lab_contact,
      lab_email,
      lab_social_url,
      lab_logo,
      lab_note
    } = req.body;

    if (!lab_id) {
      throw new AppError("lab_id is required", 400);
    }

    const data = {
      lab_id,
      lab_name,
      lab_address,
      lab_contact,
      lab_email,
      lab_social_url,
      lab_logo,
      lab_note,
      updated_at: getEpochTime(),
      updated_by: req.user?.user_id
    };

    const response = await labService.updateLab(data);

    res.status(response.statusCode).json(response);

  }),


  deleteLab: asyncHandler(async (req, res) => {
   const { lab_id } = req.params;
    const deleted_by = req.user?.user_id;
    const deleted_at = getEpochTime();

    if (!lab_id) {
      throw new AppError("lab_id is required", 400);
    }

    const response = await labService.deleteLab(
      lab_id,
      deleted_by,
      deleted_at
    );

    res.status(response.statusCode).json(response);

  }),



  getLabs: asyncHandler(async (req, res) => {

    const response = await labService.getLabs();

    res.status(response.statusCode).json(response);

  })

};