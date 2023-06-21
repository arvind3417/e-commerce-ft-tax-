import * as validators from "../helpers/validators";
import generateCrud from "../helpers/generateCrud";
import {Service} from "../models/service";

// Models

const FIELDS = [
  { name: "name", validator: validators.isString, required: true },
  { name: "price", validator: validators.isNumber,required:true },
  
];

export const {
    getAllMethod: getServices,
    getByIdMethod: getService,
    postMethod: postService,
    patchMethod: patchService,
    deleteMethod: deleteService,
  } = generateCrud(Service, FIELDS);
  
