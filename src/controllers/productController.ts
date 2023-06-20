import * as validators from "../helpers/validators";
import generateCrud from "../helpers/generateCrud";
import {Product} from "../models/product";

// Models

const FIELDS = [
  { name: "name", validator: validators.isString, required: true },
  { name: "price", validator: validators.isNumber,required:true },
  
];

export const {
    getAllMethod: getProducts,
    getByIdMethod: getProduct,
    postMethod: postProduct,
    patchMethod: patchProduct,
    deleteMethod: deleteProduct,
  } = generateCrud(Product, FIELDS);
  
