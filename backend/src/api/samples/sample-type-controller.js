import { AppError } from "../../middlewares/app-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { getEpochTime } from "../../utils/epoch.js";
import { sampleTypeService } from "./sample-type-service.js";

export const sampleTypeController = {
 getSamples: asyncHandler(async (req, res) => {

    const response = await sampleTypeService.getSamples();

    res.status(response.statusCode).json(response);
  }),

}