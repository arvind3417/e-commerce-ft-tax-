import mongoose from 'mongoose';

// const orderSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   items: [{
//     item: { type: mongoose.Schema.Types.ObjectId, refPath: 'itemType' },
//     itemType: { type: String, enum: ['Product', 'Service'] },
//     quantity: { type: Number, default: 1 },
//   }],
//   totalAmount: { type: Number },
//   createdAt: { type: Date, default: Date.now },
// });


const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CartItem',
  }],
  total: { type: Number },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'] },
  createdAt: { type: Date, default: Date.now },
});




export const Order = mongoose.model('Order', orderSchema);
