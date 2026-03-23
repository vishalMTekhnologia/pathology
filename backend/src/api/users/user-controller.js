import { asyncHandler } from "../../utils/async-handler.js";
import { usersService } from "./user-service.js";
import { AppError } from "../../middlewares/app-error.js";

export const userController = {

    getLabTechnicians: asyncHandler(async (req, res) => {
        const lab_id = req.user?.lab_id;
        if (!lab_id) {
            throw new AppError("lab_id is required", 400);
        }
        const response = await usersService.getLabTechnicians(lab_id);
        res.status(response.statusCode).json(response);
    }),

     getBloodCollectionBoy: asyncHandler(async (req, res) => {
     const lab_id = req.user?.lab_id;
      if (!lab_id) {
            throw new AppError("lab_id is required", 400);
        }
        const response = await usersService.getBloodCollectionBoy(lab_id);
        res.status(response.statusCode).json(response);
    
      }),
};