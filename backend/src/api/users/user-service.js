import { query } from "../../utils/database.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { ResponseBuilder } from "../../utils/response.js";
import { AppError } from "../../middlewares/app-error.js";
import jwt from "jsonwebtoken";
import { getEpochTime } from "../../utils/epoch.js";
import { encrypt } from "../../utils/encryption.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";

export const usersService = {
    registerLabUser: async ({
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
    }) => {
        // Encrypt + Hash
        const hashedPassword = await bcrypt.hash(user_password, 10);

        const encryName = encrypt(full_name).encryptedData;
        const encryEmail = encrypt(user_email).encryptedData;
        const encryMobile = encrypt(contact_no).encryptedData;
        const encryAddress = encrypt(address).encryptedData;
        const encryProPic = pro_pic ? encrypt(pro_pic).encryptedData : null;

        // Call SP (User + Lab Mapping)
        const spQuery = `CALL RegisterLabUser(?,?,?,?,?,?,?,?,?,?)`;

        const spResults = await query(spQuery, [
            role_id,
            encryName,
            encryEmail,
            encryMobile,
            encryAddress,
            hashedPassword,
            encryProPic,
            createdAt,
            created_by,
            lab_id,
        ]);

        const procRow = spResults?.[0]?.[0] || {};
        const message = procRow.message;
        const user_id = procRow.user_id;

        if (!user_id) {
            throw new AppError(message || "User registration failed", 400);
        }

        // Fetch User
        const [user] = await query(
            `SELECT user_id, role_id, full_name, user_email, pro_pic FROM tbl_users WHERE user_id = ? LIMIT 1`,
            [user_id]
        );

        if (!user) {
            throw new AppError("User record not found after registration", 500);
        }

        // Vault check
        const [vaultResult] = await query(
            `SELECT EXISTS(
        SELECT 1 FROM tbl_access_passwords WHERE access_pass_user_id = ?
    ) AS has_vault_password`,
            [user_id]
        );

        const hasVaultPassword = !!vaultResult.has_vault_password;

        // Tokens
        const sessionId = uuidv4();

        const accessToken = generateAccessToken({
            user_id: user.user_id,
            role_id: user.role_id,
            user_name: user.full_name,
            user_email: user.user_email,
            session_id: sessionId,
            lab_id: lab_id,
            profile_photo: user.pro_pic || "",
            photo_verified: !!user.pro_pic,
            is_vault: hasVaultPassword,
        });

        const refreshToken = generateRefreshToken({
            user_id: user.user_id,
            session_id: sessionId,
        });

        // Store Session
        await query(
            `INSERT INTO tbl_user_sessions 
    (user_session_user_id, user_session_session_id, user_session_agent, user_refresh_token, created_at)
    VALUES (?,?,?,?,?)`,
            [
                user.user_id,
                sessionId,
                clientIsWeb ? "web" : "mobile",
                refreshToken,
                createdAt,
            ]
        );

        return ResponseBuilder.success("Lab user registered successfully.", {
            accessToken,
            refreshToken,
        });
    },

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

        return ResponseBuilder.success("Blood collection boys fetched successfully", rows);

    },
};