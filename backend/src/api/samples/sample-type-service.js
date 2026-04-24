import { query } from "../../utils/database.js";
import { ResponseBuilder } from "../../utils/response.js";
import { AppError } from "../../middlewares/app-error.js";

export const sampleTypeService = {
 getSamples: async () => {

    const sql = `
      SELECT *
      FROM tbl_sample_type
    `;

    try {
      const rows = await query(sql);

      return ResponseBuilder.success("Samples fetched successfully", rows);

    } catch (err) {
      throw new AppError(err.message, 400);
    }
  },

}