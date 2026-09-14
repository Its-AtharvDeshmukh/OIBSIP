import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ingredient name is required'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['base', 'sauce', 'cheese', 'veggie']
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  threshold: {
    type: Number,
    required: true,
    default: 20
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  lastEmailNotifiedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

inventoryItemSchema.virtual('status').get(function () {
  if (this.stock === 0) return 'Out of stock';
  if (this.stock <= this.threshold) return 'Low stock';
  return 'Healthy stock';
});

inventoryItemSchema.set('toJSON', { virtuals: true });
inventoryItemSchema.set('toObject', { virtuals: true });

export default mongoose.model('InventoryItem', inventoryItemSchema);