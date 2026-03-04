import express from "express";
import { authController } from "./auth-controller.js";
import { validate } from "../../middlewares/validate.js";
import { checkJWT } from "../../middlewares/check-jwt.js";
import {
  upload,
  multerErrorHandler,
} from "../../middlewares/multer-middleware.js";
export const authRouter = (() => {
  const router = express.Router();

  // Login user
  router.post("/login", authController.login);

  // Register user
  router.post("/register",
     upload.fields([{ name: "userPhoto", maxCount: 1 }]),
      multerErrorHandler,
    authController.register);

  // Refresh token
  router.post("/refresh-token", authController.refreshToken);

  // Logout user
  router.post("/logout", authController.logout);

  // fetch all users
  router.get("/all-users", checkJWT, authController.fetchAllUsers);

  // profile fetch User
  router.get("/get-profile/:user_id",checkJWT, authController.fetchUserById);

  // fetch roles
  router.get("/roles", checkJWT, authController.fetchAllRoles);

  // update status
  router.put("/update-status", checkJWT, authController.updateUserStatus);

  // update user detials
  router.put(
    "/update",
    upload.fields([{ name: "userPhoto", maxCount: 1 }]),
    multerErrorHandler,
    checkJWT,
    authController.updateUser,
  );

  router.put("/update-prof",
      upload.fields([{ name: "userPhoto", maxCount: 1 }]),
      multerErrorHandler,
      checkJWT, 
      authController.updateUserProfile
    )

  return router;
})();
