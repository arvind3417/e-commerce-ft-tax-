import express from "express";

import { authenticateToken } from "../middleware/authToken";
import {
  getUserInfo,
  patchUser,
  deleteUser,
  resetPassword
} from "../controllers/userController";

export const userRouter = express.Router();

// User Routes //
// NOTE: User create route is not needed because it is handled by authRoutes
userRouter
  .route("/personInfo")
  .get(authenticateToken, getUserInfo)
  .patch(authenticateToken, patchUser)
  .delete(authenticateToken, deleteUser);
userRouter.route("/reset_password").patch(authenticateToken, resetPassword);
