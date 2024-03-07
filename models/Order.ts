import { ObjectId } from 'mongodb';
import { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema(
  {
    line_items: [{ type: Object }],
    name: String,
    email: String,
    city: String,
    postalCode: String,
    street: String,
    country: String,
    paid: Boolean,
  },
  { timestamps: true },
);

export default models?.Order || model('Order', OrderSchema);
