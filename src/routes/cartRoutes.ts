import express from "express";

import { authenticateToken } from "../middleware/authToken";
import {
    addcartController,removeCartItem
} from "../controllers/cartController";

export const cartRouter = express.Router();


cartRouter
  .route("/cart/:itemId/:cartType")
  .post(authenticateToken, addcartController)
  cartRouter
  .route("/cart/remove/:itemId/:cartType")
  .post(authenticateToken, removeCartItem)
