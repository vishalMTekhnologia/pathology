import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { query } from "../../utils/database.js";
import { getEpochTime } from "../../utils/epoch.js";
import { encrypt } from "../../utils/encryption.js";
import { AppError } from "../../middlewares/app-error.js";
import { ResponseBuilder } from "../../utils/response.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";


// Load environment variables
dotenv.config();

export const authService = {
  // Register User
  register: async ({
    role_id,
    full_name,
    user_email,
    contact_no,
    address,
    user_password,
    pro_pic,
    createdAt,
    clientIsWeb,  
  }) => {
    const hashedPassword = await bcrypt.hash(user_password, 10);
    const encryName = encrypt(full_name).encryptedData;
    const encryEmail = encrypt(user_email).encryptedData;
    const encryMobileNo = encrypt(contact_no).encryptedData;
    const encryAddressNo = encrypt(address).encryptedData;
    const encryUserPro = pro_pic ? encrypt(pro_pic).encryptedData : null;
    const spQuery = "CALL Register(?, ?, ?, ?, ?, ?, ?, ?);";
    const spResults = await query(spQuery, [
      role_id,
      encryName,
      encryEmail,
      encryMobileNo,
      encryAddressNo,
      hashedPassword,
      encryUserPro,
      createdAt,
    ]);
    const procRow = spResults?.[0]?.[0] || {};
    const message = procRow.message;
    const user_id = procRow.user_id;

    if (message?.toLowerCase().includes("exists")) {
      throw new AppError(message, 400);
    }

    const [user] = await query(
      `SELECT user_id, full_name, user_email FROM tbl_users WHERE user_id = ? LIMIT 1`,
      [user_id],
    );

    if (!user) {
      throw new AppError("User record not found after registration", 500);
    }

    const [result] = await query(
      `
  SELECT EXISTS(
    SELECT 1 
    FROM tbl_access_passwords ap
    WHERE ap.access_pass_user_id = ?
  ) AS has_vault_password;
  `,
      [user_id],
    );

    const hasVaultPassword = !!result.has_vault_password;

    const sessionId = uuidv4();
    const accessToken = generateAccessToken({
      user_id: user.user_id,
      role_id: user.role_id,
      role_name: user.role_name,
      user_name: user.user_name,
      user_email: user.user_email,
      session_id: sessionId,
      profile_photo:
        user.pro_pic ||
        "39ee561ae418f2b31d0f85a05fbf051019a37f3644da0512c5e903133d9925209c41d6c0b4b768171ce58b298d29889b7d149ffeb54dcc3a765d42fad77b1a1774180d55b04d339811e9629502f83416",
      photo_verified: !!user.pro_pic,
      is_vault: hasVaultPassword,
    });

    const refreshToken = generateRefreshToken({
      user_id: user.user_id,
      session_id: sessionId,
    });

    await query(
      `INSERT INTO tbl_user_sessions (user_session_user_id, user_session_session_id, user_session_agent, user_refresh_token, created_at) VALUES (?,?,?,?,?)`,
      [
        user.user_id,
        sessionId,
        clientIsWeb ? "web" : "mobile",
        refreshToken,
        createdAt,
      ],
    );

    return ResponseBuilder.success("Registration successful.", {
      accessToken,
      refreshToken,
    });
  },

  // Refresh Token
  refreshAccessToken: async (refreshToken, updatedAt) => {
    let decoded;

    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new AppError("Refresh token expired or invalid", 401);
    }

    if (!decoded?.user_id || !decoded?.session_id) {
      throw new AppError("Invalid refresh token", 401);
    }

    /* Validate session */
    const [session] = await query(
      `
    SELECT user_session_id
    FROM tbl_user_sessions
    WHERE user_session_user_id = ?
      AND user_session_session_id = ?
      AND user_refresh_token = ?
    LIMIT 1
    `,
      [decoded.user_id, decoded.session_id, refreshToken],
    );

    if (!session) {
      throw new AppError("Session not found or expired", 401);
    }

    /* Validate user */
    const [user] = await query(
      `
    SELECT user_id, full_name, pro_pic
    FROM tbl_users
    WHERE user_id = ?
      AND user_status = '1'
      AND deleted_at IS NULL
    LIMIT 1
    `,
      [decoded.user_id],
    );

    if (!user) {
      throw new AppError("User not found or inactive", 401);
    }

    /* Rotate session */
    const newSessionId = uuidv4();

    const newRefreshToken = generateRefreshToken({
      // user_id: user.user_id,
      // session_id: newSessionId,

      user_id: user.user_id,
      role_id: user.role_id,
      role_name: user.role_name,
      full_name: user.full_name,
      user_email: user.user_email,
      session_id: newSessionId,
      profile_photo:
        user.pro_pic ||
        "39ee561ae418f2b31d0f85a05fbf051019a37f3644da0512c5e903133d9925209c41d6c0b4b768171ce58b298d29889b7d149ffeb54dcc3a765d42fad77b1a1774180d55b04d339811e9629502f83416",
      photo_verified: !!user.pro_pic,
    });

    console.log("newRefreshToken : ", newRefreshToken);

    /* Optional vault check */
    const [vault] = await query(
      `
    SELECT EXISTS(
      SELECT 1
      FROM tbl_access_passwords
      WHERE access_pass_user_id = ?
    ) AS has_vault_password
    `,
      [user.user_id],
    );

    const newAccessToken = generateAccessToken({
      user_id: user.user_id,
      role_id: user.role_id,
      role_name: user.role_name,
      full_name: user.full_name,
      user_email: user.user_email,
      session_id: newSessionId,
      profile_photo:
        user.pro_pic ||
        "39ee561ae418f2b31d0f85a05fbf051019a37f3644da0512c5e903133d9925209c41d6c0b4b768171ce58b298d29889b7d149ffeb54dcc3a765d42fad77b1a1774180d55b04d339811e9629502f83416",
      photo_verified: !!user.pro_pic,
    });

    console.log("newAccessToken :", newAccessToken);
    /* Update existing session */
    await query(
      `
    UPDATE tbl_user_sessions
    SET user_session_session_id = ?,
        user_refresh_token = ?,
        updated_at = ?
    WHERE user_session_id = ?
    `,
      [newSessionId, newRefreshToken, updatedAt, session.user_session_id],
    );

    return ResponseBuilder.success("Access token refreshed", {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  },

  // Login User
  login: async ({ identifier, password, clientIsWeb }) => {
    const createdAt = getEpochTime();

    const encryptedIdentifier = encrypt(identifier).encryptedData;

    const spQuery = "CALL LoginUser(?);";
    const spResult = await query(spQuery, [encryptedIdentifier]);

    const user = spResult?.[0]?.[0];

    if (!user || !user.user_password) {
      throw new AppError("Invalid email/mobile or password", 400);
    }

    const passwordMatch = await bcrypt.compare(password, user.user_password);

    if (!passwordMatch) {
      throw new AppError("Invalid email/mobile or password", 400);
    }

    /* Session + Tokens */
    const sessionId = uuidv4();

    const accessToken = generateAccessToken({
      user_id: user.user_id,
      role_id: user.role_id,
      role_name: user.role_name,
      user_name: user.full_name,
      user_email: user.user_email,
      session_id: sessionId,
      profile_photo:user.pro_pic 
      ||"39ee561ae418f2b31d0f85a05fbf051019a37f3644da0512c5e903133d9925209c41d6c0b4b768171ce58b298d29889b7d149ffeb54dcc3a765d42fad77b1a1774180d55b04d339811e9629502f83416",
      photo_verified: !!user.pro_pic,
    });
    

    const refreshToken = generateRefreshToken({
      user_id: user.user_id,
      session_id: sessionId,
    });

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
      ],
    );

    return ResponseBuilder.success("Login successful.", {
      accessToken,
      refreshToken,
    });
  },

  // Logout User
  logoutUser: async (user_id, session_id, logoutAll) => {
    // Check if user exists and is active
    const [userRows] = await query(
      "SELECT * FROM tbl_users WHERE user_id = ? AND user_status = 1",
      [user_id],
    );

    if (!userRows) {
      throw new AppError("User not found or inactive", 400);
    }

    // Perform logout
    if (logoutAll) {
      await query(
        "DELETE FROM tbl_user_sessions WHERE user_session_user_id = ?",
        [user_id],
      );
    } else {
      await query(
        "DELETE FROM tbl_user_sessions WHERE user_session_user_id = ? AND user_session_session_id = ?",
        [user_id, session_id],
      );
    }
    return ResponseBuilder.success("Logout successful");
  },

  // fetch all roles list
  getAllRoles: async () => {
    try {
      const rows = await query(
        `
      SELECT 
       role_id,
       role_name
      FROM tbl_role
      where role_id != 1
      `,
      );

      return ResponseBuilder.success("Roles list fetched successfully", rows);
    } catch (error) {
      console.error("Error fetching roles list:", error);
      throw new AppError("Failed to fetch roles list", 500);
    }
  },

  // Profile fetch
  getUserById: async (user_id) => {
  try {

    const rows = await query(
      `
      SELECT 
        u.user_id,
        u.role_id,
        r.role_name,
        u.full_name,
        u.user_email,
        u.contact_no,
        u.address,
        u.pro_pic,
        u.user_status,
        u.created_at,
        u.updated_at
      FROM tbl_users u
      LEFT JOIN tbl_role r ON u.role_id = r.role_id
      WHERE u.user_id = ?
      AND u.deleted_at IS NULL
      `,
      [user_id]
    );

    if (!rows.length) {
      throw new AppError("User not found", 404);
    }

    return ResponseBuilder.success(
      "User details fetched successfully",
      rows[0]
    );

  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error instanceof AppError
      ? error
      : new AppError("Failed to fetch user details", 500);
  }
},

  // Fetch all users
getAllUsers: async (page = 1, limit = 10) => {
    try {
      const offset = (page - 1) * limit;

      // Get total count
      const totalResult = await query(
        `SELECT COUNT(*) AS total 
       FROM tbl_users 
       WHERE user_status = '1'`,
      );

      const totalRecords = totalResult[0].total;
      const totalPages = Math.ceil(totalRecords / limit);

      // Fetch paginated data with indexing
      const rows = await query(
        `
      SELECT 
        (@row_number:=@row_number + 1) AS index_no,
        u.user_id,
        u.role_id,
        r.role_name,
        u.full_name,
        u.user_email,
        u.contact_no,
        u.pro_pic,
        u.user_status
      FROM tbl_users u
      LEFT JOIN tbl_role r ON u.role_id = r.role_id,
      (SELECT @row_number := ?) AS rn
      WHERE u.user_status = '1'
      ORDER BY u.user_id DESC
      LIMIT ? OFFSET ?
      `,
        [offset, limit, offset],
      );

      return ResponseBuilder.success("Users list fetched successfully", {
        users: rows,
        pagination: {
          totalRecords,
          totalPages,
          currentPage: page,
          pageSize: limit,
        },
      });
    } catch (error) {
      console.error("Error fetching Users list:", error);
      throw new AppError("Failed to fetch Users list", 500);
    }
  },

  // update user status
updateUserStatus: async (user_id, user_status, updated_by) => {
    try {
      // Validate status
      if (!["0", "1"].includes(user_status)) {
        throw new AppError("Invalid user status value", 400);
      }

      // Check if user exists
      const existingUser = await query(
        `SELECT user_id FROM tbl_users WHERE user_id = ? AND deleted_at IS NULL`,
        [user_id],
      );

      if (existingUser.length === 0) {
        throw new AppError("User not found", 404);
      }

      // Update status
      await query(
        `
      UPDATE tbl_users 
      SET 
        user_status = ?,
        updated_at = ?,
        updated_by = ?
      WHERE user_id = ?
      `,
        [user_status, Date.now(), updated_by, user_id],
      );

      return ResponseBuilder.success("User status updated successfully", null);
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  },

// user profile update
updateUserProfile: async (
    user_id,  
    full_name,
    user_email,
    contact_no,
    address,
    pro_pic, 
    updated_at, 
    updated_by
  ) => {
  if (!user_id) {
    throw new AppError("User id is required", 400);
  }
 const encryName = encrypt(full_name).encryptedData;
    const encryEmail = encrypt(user_email).encryptedData;
    const encryMobileNo = encrypt(contact_no).encryptedData;
    const encryAddressNo = encrypt(address).encryptedData;
    const encryProPic = encrypt(pro_pic).encryptedData
  await query(
    `CALL UpdateUserProfile(?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user_id,
      encryName,
      encryEmail,
      encryMobileNo,
      encryAddressNo,
      encryProPic,
      updated_at,
      updated_by
     
    ]
  );
  return ResponseBuilder.success(
    "User updated successfully"
  );
},

  // update user details
updateUser: async (
    role_id,
    user_id,  
    full_name,
    user_email,
    contact_no,
    address,
    pro_pic, 
    updated_at, 
    updated_by
  ) => {
  if (!user_id) {
    throw new AppError("User id is required", 400);
  }
   
 const encryName = encrypt(full_name).encryptedData;
    const encryEmail = encrypt(user_email).encryptedData;
    const encryMobileNo = encrypt(contact_no).encryptedData;
    const encryAddressNo = encrypt(address).encryptedData;
    const encryProPic = encrypt(pro_pic).encryptedData
   
  await query(
    `CALL UpdateUser(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      role_id,
      user_id,
      encryName,
      encryEmail,
      encryMobileNo,
      encryAddressNo,
      encryProPic,
      updated_at,
      updated_by
     
    ]
  );
  return ResponseBuilder.success(
    "User updated successfully"
  );
},

};
