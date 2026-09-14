import mongoose from 'mongoose';

const pizzaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, default: 'Signature' },
  image: { type: String, required: true }, // The URL
  imagePublicId: { type: String }, // Cloudinary asset ID
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false }, // SOFT DELETE to protect historical orders
  defaultConfig: {
    base: { type: String },
    sauce: { type: String },
    cheese: { type: String },
    veggies: [{ type: String }]
  }
}, { timestamps: true });

export default mongoose.model('Pizza', pizzaSchema);