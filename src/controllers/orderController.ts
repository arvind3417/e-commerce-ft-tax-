import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { User } from "../models/users";
import * as CustomErrors from "../errors";
import asyncWrapper from "../helpers/asyncWrapper";
import { httpResponse } from "../helpers";
// import { ObjectId } from 'mongoose';
import mongoose from "mongoose";

export const orderController = asyncWrapper(
    async (_req: Request, _res: Response, _next: NextFunction) => {
        try {
            const { userId } = _req.params;
            const user = await User.findById(userId);
            // Perform additional actions to confirm the order
            // ...
            if (!user) {
                _res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
                return;
              }
            // Clear the cart
            user.cart = [];
            await user.save();
        
            _res.json({ message: 'Order confirmed successfully' });
          } catch (error) {
            _res.status(500).json({ error: 'Error confirming the order' });
          }
    }
  );
  