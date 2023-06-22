import express from "express";

import { authenticateToken } from "../middleware/authToken";
import {
  getAllOrders,
  orderController
} from "../controllers/orderController";
import { adminMiddleware } from "../middleware/isAdmin";

export const orderRouter = express.Router();


orderRouter
  .route("/order")
  .post(authenticateToken, orderController)
  .get(authenticateToken,adminMiddleware, getAllOrders)

