import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { User } from "../models/users";
import * as CustomErrors from "../errors";
import asyncWrapper from "../helpers/asyncWrapper";
import { httpResponse } from "../helpers";
import { Product } from "../models/product";
import { Service } from "../models/service";
const calculateTax = (price: number, taxRate: number): number => {
  return (price * taxRate) / 100;
};

// Function to calculate the total bill
const calculateTotal = (items: any[]): number => {
  let total = 0;
  for (const item of items) {
    total += (item.price + item.tax) * item.quantity;
  }
  return total;
};
export const billController = asyncWrapper(
  async (_req: Request, _res: Response, _next: NextFunction) => {
    try {
      
      // const { userId } = req.params;
      const user = await User.findById(_req.user.userId);
if (!user) {
  return _next(new CustomErrors.NotFoundError("User not found"));

  // _res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
  // return;
}

if(user.cart.length ===0){
  // _next(CustomErrors.NotFoundError)
  return _next(new CustomErrors.NotFoundError("Cart is empty"));

  // _res.status(StatusCodes.NOT_FOUND).json({ error: "Cart is Empty" });

}

const populateItems = async () => {
  const populateProduct = Product.find({ _id: { $in: user.cart.map(item => item.item) } });
  const populateService = Service.find({ _id: { $in: user.cart.map(item => item.item) } });

  const [products, services] = await Promise.all([populateProduct, populateService]);

  const itemMap = {};
  for (const product of products) {
    itemMap[product._id.toString()] = product;
  }
  for (const service of services) {
    itemMap[service._id.toString()] = service;
  }

  const populatedCart = user.cart.map(item => {
    const populatedItem = item.item ? itemMap[item.item.toString()] : undefined;
    const taxRate = calculateTaxRate(item.cartType, populatedItem?.price);
    return {
      item: populatedItem,
      quantity: item.quantity,  // Include the quantity property
      price: populatedItem?.price,
      tax: populatedItem ? calculateTax(populatedItem.price, taxRate) : 0,
    };
  });

  return populatedCart;
};

const populatedCart = await populateItems();
const total = calculateTotal(populatedCart);
_res.status(StatusCodes.CREATED).json(
  httpResponse(true, "User created successfully", {
    items:populatedCart, total 
  })
);
// _res.json({ items: populatedCart, total });      // tems: itemsWithTax, total });
    } catch (error) {
      _res.status(500).json({ error: "Error retrieving total bill" });
    }
  }
);

const calculateTaxRate = (cartType: string| undefined, price?: number): number => {
  if (!price) {
    return 0;
  }

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


  
// export const billController = asyncWrapper(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { userId } = req.params;
//       const user = await User.findById(userId).populate('cart.item');
//       let total = 0;

//       const calculateTax = (price: number, taxRate: number) =>
//         (price * taxRate) / 100;

//       const itemsWithTax = user!.cart.map((item: any) => {
//         let tax;
//         if (item.cartType === 'Product') {
//             console.log('====================================');
//             console.log(item.item);
//             console.log('====================================');
//           if (item.item.price > 1000 && item.item.price <= 5000) {
//             tax = calculateTax(item.item.price, 12);
//           } else if (item.item.price > 5000) {
//             tax = calculateTax(item.item.price, 18);
//           } else {
//             tax = 0;
//           }
//         } else if (item.cartType === 'Service') {
//           if (item.item.price > 1000 && item.item.price <= 8000) {
//             tax = calculateTax(item.item.price, 10);
//           } else if (item.item.price > 8000) {
//             tax = calculateTax(item.item.price, 15);
//           } else {
//             tax = 0;
//           }
//         }
//         total += item.item.price + tax;

//         return {
//           item: item.item,
//           quantity: 1,
//           price: item.item.price,
//           tax,
//         };
//       });

//       res.json({ items: itemsWithTax, total });
//     } catch (error) {
//       res.status(500).json({ error: 'Error retrieving total bill' });
//     }
//   }
// );
