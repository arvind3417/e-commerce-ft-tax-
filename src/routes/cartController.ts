import express from "express";

import { authenticateToken } from "../middleware/authToken";
import {
    cartController
} from "../controllers/cartController";

export const cartRouter = express.Router();

// User Routes //
// NOTE: User create route is not needed because it is handled by authRoutes
cartRouter
  .route("/:userId/cart/:itemId/:cartType")
  .post(authenticateToken, cartController)
