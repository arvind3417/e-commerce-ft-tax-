import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { User } from "../models/users";
import * as CustomErrors from "../errors";
import asyncWrapper from "../helpers/asyncWrapper";
import { httpResponse } from "../helpers";
// import { ObjectId } from 'mongoose';
import mongoose from "mongoose";



export const cartController = asyncWrapper(
  async (_req: Request, _res: Response, _next: NextFunction) => {
    try {
      const { userId, itemId, cartType } = _req.params;
      const user = await User.findById(userId);

      if (!user) {
        _res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
        return;
      }
            const existingItem = user.cart.find((item) => item.item?.toString() === itemId && item.cartType === cartType);

      if (existingItem) {
        _res.status(StatusCodes.BAD_REQUEST).json({ error: 'Item already exists in the cart' });
        return;
      }

      const itemIdIsValid =  mongoose.Types.ObjectId.isValid(itemId);
      if (!itemIdIsValid) {
        _res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid item ID' });
        return;
      }

      const item: { item: mongoose.Types.ObjectId; cartType: "Product" | "Service" } = {
        item: new mongoose.Types.ObjectId(itemId),
        cartType: cartType as "Product" | "Service",
      };

      user.cart.push(item);
      await user.save();
      _res.json(user);
    } catch (error:any) {
      console.log('====================================');
      console.log(error.message);
      console.log('====================================');
      _res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error adding item to cart' });
    }
  }
);
