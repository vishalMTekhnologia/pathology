import { jwtDecode } from "jwt-decode";
import { authService } from "./auth-service.js";
import { getEpochTime } from "../../utils/epoch.js";
import isWebClient from "../../utils/is-web-client.js";
import { ResponseBuilder } from "../../utils/response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { AppError } from "../../middlewares/app-error.js";
import { validatePassword } from "../../utils/validate-password.js";
import { photoToAzureBlob } from "../../middlewares/multer-middleware.js";
import { checkAdmins } from "../../utils/check-admin.js";

export const authController = {
  // Login User
  login: asyncHandler(async (req, res, next) => {
    try {
      const { identifier, password } = req.body;

      /* Basic validation */
      if (!identifier || !password) {
        throw new AppError(
          "Identifier (email/mobile) and password are required",
          400,
        );
      }

      const clientIsWeb =
        req.headers["user-agent"]?.toLowerCase().includes("mozilla") || false;

      const response = await authService.login({
        identifier,
        password,
        clientIsWeb,
      });

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }),

  // Register User
  register: asyncHandler(async (req, res) => {
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

    if (!role_id || !full_name || !user_email || !contact_no) {
      throw new AppError(
        "All fields are required: role, name, email, mobile number and password",
        400,
      );
    }
    if (!validatePassword(user_password)) {
      throw new AppError(
        "Password must be at least 8 characters long and combination of letter, number and special character",
        400,
      );
    }

    const result = await authService.register({
      role_id,
      full_name,
      user_email,
      contact_no,
      address,
      user_password,
      pro_pic,
      createdAt,
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
      return res.status(result.statusCode).json(result);
    }

    return res.status(result.statusCode).json(result);
  }),

  // Reftresh Token
  refreshToken: asyncHandler(async (req, res) => {
    const updatedAt = getEpochTime();
    const clientIsWeb = isWebClient(req);

    let refreshToken;

    if (clientIsWeb) {
      refreshToken = req.cookies?.refresh_token;
    } else {
      const authHeader = req.headers.authorization;
      if (!authHeader?.toLowerCase().startsWith("bearer ")) {
        throw new AppError("No refresh token provided", 401);
      }
      refreshToken = authHeader.replace(/^Bearer\s+/i, "");
    }

    if (!refreshToken) {
      throw new AppError("No refresh token provided", 401);
    }

    const result = await authService.refreshAccessToken(
      refreshToken,
      updatedAt,
    );

    /* Web → update cookie */
    if (clientIsWeb && result.success) {
      res.cookie("refresh_token", result.data.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      /* Don’t expose refresh token in response */
      delete result.data.refreshToken;
    }

    return res.status(result.statusCode).json(result);
  }),

  logout: asyncHandler(async (req, res) => {
    const clientIsWeb = isWebClient(req);
    const { logoutAll = 0 } = req.body;

    let refreshToken = "";

    // Try to get refresh token from cookie or header
    if (clientIsWeb) {
      refreshToken = req.cookies?.refresh_token;

      console.log(" Logout - Cookie check:", {
        hasCookie: !!refreshToken,
        allCookies: Object.keys(req.cookies || {}),
        cookieValue: refreshToken ? "Present" : "Missing",
      });
    } else {
      const authHeader = req.header("Authorization");
      if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
        throw new AppError("No refresh token provided", 401);
      }
      refreshToken = authHeader.replace(/^Bearer\s+/i, "");
    }

    // If no refresh token, but we have access token in Authorization header
    if (!refreshToken) {
      const accessToken = req
        .header("Authorization")
        ?.replace(/^Bearer\s+/i, "");

      if (accessToken) {
        try {
          const decoded = jwtDecode(accessToken);
          const { user_id, session_id } = decoded || {};

          if (user_id && session_id) {
            console.log(" Logout - Using access token to logout:", {
              user_id,
              session_id,
            });

            const result = await authService.logoutUser(
              user_id,
              session_id,
              logoutAll,
            );

            if (result.success && clientIsWeb) {
              res.clearCookie("refresh_token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite:
                  process.env.NODE_ENV === "production" ? "none" : "lax",
                path: "/",
              });
            }

            return res.status(result.statusCode).json(result);
          }
        } catch (error) {
          console.error(" Failed to decode access token:", error);
        }
      }

      throw new AppError("No refresh token provided", 401);
    }

    // Decode refresh token
    let decoded;
    try {
      decoded = jwtDecode(refreshToken);
    } catch (error) {
      console.error(" Failed to decode refresh token:", error);
      const err = ResponseBuilder.unauthorized("Invalid refresh token format");
      return res.status(err.statusCode).json(err);
    }

    const { user_id, session_id } = decoded || {};
    if (!user_id || !session_id) {
      throw new AppError("Malformed refresh token", 401);
    }

    console.log(" Logout - Processing:", { user_id, session_id, logoutAll });

    const result = await authService.logoutUser(user_id, session_id, logoutAll);

    if (result.success && clientIsWeb) {
      res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      });

      console.log(" Logout - Cookie cleared");
    }

    return res.status(result.statusCode).json(result);
  }),

  // Profile fetch controller
  fetchUserById: asyncHandler(async (req, res) => {
    // const { user_id } = req.params;
      const user_id = req.user?.user_id;
    
    if (!user_id) {
      throw new AppError("user_id is required", 400);
    }
    const response = await authService.getUserById(Number(user_id));
    return res.status(response.statusCode).json(response);
  }),

  // Fetch All Users (Only Super Admin)
  fetchAllUsers: asyncHandler(async (req, res) => {
    const user_id = req.user.user_id;
    // const role_name = req.user?.role_name;
    // Pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!user_id) {
      throw new AppError("User id is required", 400);
    }

    // // Allow only super admin
    // if (role_name !== "super_admin") {
    //   throw new AppError("Only super admin can access users list", 403);
    // }

    const response = await authService.getAllUsers(page, limit);
    return res.status(response.statusCode).json(response);
  }),

  // fetch Roles list
  fetchAllRoles: asyncHandler(async (req, res) => {
    const user_id = req.user.user_id;
    const role_name = req.user?.role_name;
    if (!user_id) {
      throw new AppError("User id is required", 400);
    }

    // Allow only super admin
    if (role_name !== "super_admin") {
      throw new AppError("Only super admin can access role list", 403);
    }

    const response = await authService.getAllRoles();
    return res.status(response.statusCode).json(response);
  }),

  // update user status
  updateUserStatus: asyncHandler(async (req, res) => {
    const login_user_id = req.user.user_id;
    const role_name = req.user?.role_name;

    const { user_id, user_status } = req.body;

    if (!user_id || user_status === undefined) {
      throw new AppError("user_id and user_status are required", 400);
    }

    // Only super_admin allowed
    if (role_name !== "super_admin") {
      throw new AppError("Only super admin can update user status", 403);
    }

    const response = await authService.updateUserStatus(
      user_id,
      user_status,
      login_user_id,
    );

    return res.status(response.statusCode).json(response);
  }),

  // user profile update
  updateUserProfile: asyncHandler(async (req, res) => {
    const { user_id } = req.query;
    const { full_name, user_email, contact_no, address } = req.body;
    const updated_by = req.user.user_id;
    const updated_at = getEpochTime();
    const userProFile = req.files?.userPhoto?.[0] || null;
    let pro_pic = null;
    if (userProFile) {
      pro_pic = await photoToAzureBlob(userProFile, "userProfile");
    }
    const response = await authService.updateUserProfile(
      user_id,
      full_name,  
      user_email,
      contact_no,
      address,
      pro_pic,
      updated_at,
      updated_by,
    );

    return res.status(response.statusCode).json(response);
  }),

  //  update user detials
  updateUser: asyncHandler(async (req, res) => {
    const { user_id } = req.query;
    const { role_id, full_name, user_email, contact_no, address } = req.body;
    const updated_by = req.user.user_id;
    const updated_at = getEpochTime();
    const userProFile = req.files?.userPhoto?.[0] || null;
    let pro_pic = null;
    if (userProFile) {
      pro_pic = await photoToAzureBlob(userProFile, "userProfile");
    }
    // if (role_id === 1) {
    //   throw new AppError("You can not set role is super admin",400,);
    // }

    // Role check: only super_admin or admin
    await checkAdmins(user_id);

    const response = await authService.updateUser(
      role_id,
      user_id,
      full_name,
      user_email,
      contact_no,
      address,
      pro_pic,
      updated_at,
      updated_by,
    );

    return res.status(response.statusCode).json(response);
  }),
};
