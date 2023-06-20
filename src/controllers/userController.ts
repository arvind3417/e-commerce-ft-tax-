import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import * as CustomError from "../errors";
import { httpResponse } from "../helpers";
import { User } from "../models/users";
import asyncWrapper from "../helpers/asyncWrapper";
import { hashCompare } from "../helpers/hashPassword";

export const getUserInfo = asyncWrapper(
  async (_req: Request, _res: Response, _next: NextFunction) => {
    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(_req.user),
        },
      },
      {
        $project: {
          __v: 0,
          password: 0,
        },
      },
    ]);
    if (!user || user.length === 0) {
      _next(new CustomError.NotFoundError("User not found"));
    } else {
      _res
        .status(StatusCodes.OK)
        .json(httpResponse(true, "User info retrieved successfully", user[0]));
    }
  }
);

export const patchUser = asyncWrapper(
  async (_req: Request, _res: Response, _next: NextFunction) => {
    const user = await User.findOneAndUpdate(
      {
        _id: _req.user,
      },
      [
        {
          $set: _req.body,
        },
        {
          $project: {
            password: 0,
            __v: 0,
          },
        },
      ],
      {
        new: true,
      }
    );
    if (!user) {
      _next(new CustomError.NotFoundError("User not found"));
    } else {
      _res
        .status(StatusCodes.OK)
        .json(httpResponse(true, "User updated", user));
    }
  }
);

export const deleteUser = asyncWrapper(
  async (_req: Request, _res: Response, _next: NextFunction) => {
    const user = await User.deleteOne({ _id: _req.user });
    if (user.deletedCount !== 1) {
      _next(new CustomError.NotFoundError("User not found"));
    } else {
      _res
        .status(StatusCodes.NO_CONTENT)
        .json(httpResponse(true, "User deleted", {}));
    }
  }
);

export const resetPassword = asyncWrapper(
  async (_req: Request, _res: Response, _next: NextFunction) => {
    const user = await User.findOne({ _id: _req.user });
    if (!user) {
      return _next(new CustomError.NotFoundError("User not found"));
    }
    if (!_req.body.oldPassword || !_req.body.newPassword) {
      return _next(new CustomError.BadRequestError("Missing password"));
    }
    if (!hashCompare(_req.body.oldPassword, user.password ?? "")) {
      return _next(new CustomError.BadRequestError("Wrong password"));
    }
    user.password = _req.body.newPassword;
    await user.save();
    _res
      .status(StatusCodes.OK)
      .json(httpResponse(true, "Password updated", {}));
  }
);