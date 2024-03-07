import { ObjectId } from 'mongodb';
import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    category: {
      type: ObjectId,
      ref: 'Category',
    },
    images: { type: [ObjectId], ref: 'File', default: [] },
    desc: String,
    price: { type: Number, required: true },
    properties: { type: Object },
  },
  { timestamps: true },
);

export default models?.Product || model('Product', ProductSchema);
