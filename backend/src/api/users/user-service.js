import { query } from "../../utils/database.js";
import { ResponseBuilder } from "../../utils/response.js";
import { AppError } from "../../middlewares/app-error.js";

export const usersService = {

    getLabTechnicians: async (labId) => {
        try {
            if (!labId) {
                throw new AppError("lab_id is required", 400);
            }
            const [rows] = await query('CALL GetLabTechnicians(?)', [labId]);

            const data = rows;
            return ResponseBuilder.success(
                "Lab technicians fetched successfully",
                data,
                200
            );
        } catch (error) {
            throw error instanceof AppError
                ? error
                : new AppError(error.message, 500);
        }
    },

      getBloodCollectionBoy: async (labId) => {

    const sql = `CALL GetLabBloodCollectionBoy(?)`;

    const [rows] = await query(sql, [labId]);

    return ResponseBuilder.success( "Blood collection boys fetched successfully", rows);

  },
};