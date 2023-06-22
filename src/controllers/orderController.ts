import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { User } from "../models/users";
import { Order } from "../models/orders";
import asyncWrapper from "../helpers/asyncWrapper";
import { httpResponse } from "../helpers";
import { Product } from "../models/product";
import { Service } from "../models/service";

const calculateTaxRate = (cartType: string|undefined, price: number): number => {
  if (cartType === "Product") {
    if (price > 1000 && price <= 5000) {
      return 12;
    } else if (price > 5000) {
      return 18;
    }
  } else if (cartType === "Service") {
    if (price > 1000 && price <= 8000) {
      return 10;
    } else if (price > 8000) {
      return 15;
    }
  }
  return 0;
};

const calculateTax = (price: number, taxRate: number): number => {
  return (price * taxRate) / 100;
};

const calculateTotal = (cart: any[]): number => {
  let total = 0;
  for (const item of cart) {
    // const taxRate = calculateTaxRate(item.cartType, item.item.price);
    // const tax = calculateTax(item.item.price, taxRate);
    total += (item.item.price + item.tax) * item.quantity;
  }
  return total;
};

export const orderController = asyncWrapper(
  async (_req: Request, _res: Response, _next: NextFunction) => {
    try {
      const user = await User.findById(_req.user.userId);

      if (!user) {
        _res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
        return;
      }

      const populateProduct = Product.find({
        _id: { $in: user.cart.map((item) => item.item) },
      });
      const populateService = Service.find({
        _id: { $in: user.cart.map((item) => item.item) },
      });

      const [products, services] = await Promise.all([
        populateProduct,
        populateService,
      ]);

      const itemMap = {};
      for (const product of products) {
        itemMap[product._id.toString()] = product;
      }
      for (const service of services) {
        itemMap[service._id.toString()] = service;
      }

      const orderItems = user.cart.map((item) => {
        const populatedItem = item.item ? itemMap[item.item.toString()] : undefined;
        const taxRate = calculateTaxRate(item.cartType, populatedItem?.price);
        const tax = calculateTax(populatedItem?.price, taxRate);
        return {
          item: populatedItem,
          itemType: item.cartType,
          quantity: item.quantity,
          price: populatedItem?.price,
          tax: tax,
        };
      });

      const totalAmount = calculateTotal(orderItems);

      const order = new Order({
        user: user._id,
        items: orderItems,
        totalAmount,
      });

      await order.save();

      user.cart = [];
      await user.save();

      _res.json(order);
    } catch (error: any) {
      console.log(error.message);
      _res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Error creating the order",
      });
    }
  }
);


export const getAllOrders = asyncWrapper(
  async (_req: Request, _res: Response, _next: NextFunction) => {
    try {
      const orders = await Order.find();
      _res.json(orders);
    } catch (error: any) {
      console.log(error.message);
      _res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Error retrieving orders",
      });
    }
  }
);
