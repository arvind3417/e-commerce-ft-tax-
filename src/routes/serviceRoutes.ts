import express from "express";
import {
    getServices,
    getService,
    postService,
    patchService,
    deleteService
} from "../controllers/serviceController";
import { authenticateToken } from "../middleware/authToken";
import { adminMiddleware } from "../middleware/isAdmin";

export const ServiceRouter = express.Router();

ServiceRouter.route("/").get(getServices).post(authenticateToken,adminMiddleware,postService);
ServiceRouter.route("/:id").get(authenticateToken,getService).patch(authenticateToken,adminMiddleware,patchService).delete(authenticateToken,adminMiddleware,deleteService);
