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

  }),

  getLabsByLabId : asyncHandler(async (req, res) => {
 const lab_id = req.user?.lab_id;
    
    if (!lab_id) {
      throw new AppError("Lab ID is required", 400);
    }

  const response = await labService.getLabsByLabId(lab_id);

  res.status(200).json(response);
}),

  // Lab Users
   assignLabUsers: asyncHandler(async (req, res) => {

    const { lab_id, user_ids } = req.body;

    if (!lab_id || !user_ids) {
      throw new AppError("lab_id and user_ids are required", 400);
    }

    const response = await labService.assignLabUsers({
      lab_id,
      user_ids,
      created_at: getEpochTime(),
      created_by: req.user?.user_id
    });

    res.status(response.statusCode).json(response);
  }),

   deleteLabUsers: asyncHandler(async (req, res) => {
    const { lab_user_id } = req.body;

    if (!lab_user_id) {
      throw new AppError("lab_user_id is required", 400);
    }
    const user_id = req.user?.user_id;
    if (!user_id) {
      throw new AppError("Unauthorized", 401);
    }

    const response = await labService.deleteLabUser(
      lab_user_id,
      getEpochTime(),
      user_id
    );

    res.status(response.statusCode).json(response);

  })

};