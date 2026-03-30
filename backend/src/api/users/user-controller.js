import { asyncHandler } from "../../utils/async-handler.js";
import { usersService } from "./user-service.js";
import { AppError } from "../../middlewares/app-error.js";
import { getEpochTime } from "../../utils/epoch.js";
import isWebClient from "../../utils/is-web-client.js";
import { ResponseBuilder } from "../../utils/response.js";
import { validatePassword } from "../../utils/validate-password.js";
import { photoToAzureBlob } from "../../middlewares/multer-middleware.js";
import { checkAdmins } from "../../utils/check-admin.js";

export const userController = {
      // 🔐 Role check
  checkAdmin: (req) => {
    const allowedRoles = [1, 2]; // super_admin, admin
    if (!allowedRoles.includes(req.user?.role_id)) {
      throw new AppError("Access denied. Admin only", 403);
    }
  },

    registerLabUser: asyncHandler(async (req, res) => {
          userController.checkAdmin(req);
        const {
            role_id,
            full_name,
            user_email,
            contact_no,
            address,
            user_password,
        } = req.body;

        const userPhotoFile = req.files?.userPhoto?.[0] || null;
        let pro_pic = null;

        if (userPhotoFile) {
            pro_pic = await photoToAzureBlob(userPhotoFile, "UserPro");
        }

        const clientIsWeb = isWebClient(req);
        const createdAt = getEpochTime();

        // From token
        const created_by = req.user?.user_id;
        const lab_id = req.user?.lab_id;

        if (!created_by || !lab_id) {
            throw new AppError("Unauthorized: Invalid token data", 401);
        }

        if (!role_id || !full_name || !user_email || !contact_no || !user_password) {
            throw new AppError(
                "All fields are required: role, name, email, mobile number and password",
                400
            );
        }

        if (!validatePassword(user_password)) {
            throw new AppError(
                "Password must be at least 8 characters long and contain letter, number and special character",
                400
            );
        }

        const result = await usersService.registerLabUser({
            role_id,
            full_name,
            user_email,
            contact_no,
            address,
            user_password,
            pro_pic,
            createdAt,
            created_by,
            lab_id,
            clientIsWeb,
        });

        if (result.success && clientIsWeb) {
            res.cookie("refresh_token", result.data.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            delete result.data.refreshToken;
        }

        return res.status(result.statusCode).json(result);
    }),

    getLabTechnicians: asyncHandler(async (req, res) => {
         userController.checkAdmin(req);
        const lab_id = req.user?.lab_id;
        if (!lab_id) {
            throw new AppError("lab_id is required", 400);
        }
        const response = await usersService.getLabTechnicians(lab_id);
        res.status(response.statusCode).json(response);
    }),

    getBloodCollectionBoy: asyncHandler(async (req, res) => {
         userController.checkAdmin(req);
        const lab_id = req.user?.lab_id;
        if (!lab_id) {
            throw new AppError("lab_id is required", 400);
        }
        const response = await usersService.getBloodCollectionBoy(lab_id);
        res.status(response.statusCode).json(response);

    }),
};