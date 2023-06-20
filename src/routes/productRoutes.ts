import express from "express";
import {
    getProducts,
    getProduct,
    postProduct,
    patchProduct,
    deleteProduct
} from "../controllers/productController";
import { authenticateToken } from "../middleware/authToken";

export const productRouter = express.Router();

productRouter.route("/").get(getProducts).post(authenticateToken,postProduct);
productRouter.route("/:id").get(authenticateToken,getProduct).patch(authenticateToken,patchProduct).delete(authenticateToken,deleteProduct);
