import { ObjectId } from 'mongodb';
import { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  parent: {
    type: ObjectId,
    ref: 'Category',
  },
  properties: [{ type: Object }],
});

export default models?.Category || model('Category', CategorySchema);
