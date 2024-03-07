import { ObjectId } from 'mongodb';
import { Schema, model, models } from 'mongoose';

const FileSchema = new Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    size: Number,
    mimetype: String,
  },
  {
    timestamps: true,
  },
);

export default models?.File || model('File', FileSchema);
