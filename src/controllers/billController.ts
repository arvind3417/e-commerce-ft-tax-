// import { NextFunction, Request, Response } from "express";
// import { StatusCodes } from "http-status-codes";

// import { User } from "../models/users";
// import * as CustomErrors from "../errors";
// import asyncWrapper from "../helpers/asyncWrapper";
// import { httpResponse } from "../helpers";

// // app.get('/users/:userId/totalBill', 
// // async (req, res) => {
  
// //   });

// // export const billController = asyncWrapper(
// //     async (_req:Request,_res: Response, _next: NextFunction) => {
// //         try {
// //             const { userId } = _req.params;
// //             const user = await User.findById(userId).populate('cart.item') ;
// //             let total = 0;
        
// //             const calculateTax = (price, taxRate) => (price * taxRate) / 100;
        
// //             const itemsWithTax = user!.cart.map((item) => {
// //               let tax;
// //               if (item.cartType === 'Product') {
// //                 if (item.item.price > 1000 && item.item.price <= 5000) {
// //                   tax = calculateTax(item.item.price, 12);
// //                 } else if (item.item.price > 5000) {
// //                   tax = calculateTax(item.item.price, 18);
// //                 } else {
// //                   tax = 0;
// //                 }
// //               } else if (item.cartType === 'Service') {
// //                 if (item.item.price > 1000 && item.item.price <= 8000) {
// //                   tax = calculateTax(item.item.price, 10);
// //                 } else if (item.item.price > 8000) {
// //                   tax = calculateTax(item.item.price, 15);
// //                 } else {
// //                   tax = 0;
// //                 }
// //               }
// //               total += item.item.price + tax;
        
// //               return {
// //                 item: item.item,
// //                 quantity: 1,
// //                 price: item.item.price,
// //                 tax,
// //               };
// //             });
        
// //             res.json({ items: itemsWithTax, total });
// //           } catch (error) {
// //             res.status(500).json({ error: 'Error retrieving total bill' });
// //           }
// //     }
// // )