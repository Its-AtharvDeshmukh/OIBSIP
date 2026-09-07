import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerInfo: {
    name: String,
    email: String,
    address: String,
    phone: String
  },
  pizzaConfig: {
    base: {
      type: String,
      required: true
    },
    sauce: {
      type: String,
      required: true
    },
    cheese: {
      type: String,
      required: true
    },
    veggies: {
      type: [String],
      default: []
    }
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentDetails: {
    razorpayOrderId: {
      type: String,
      required: true
    },
    razorpayPaymentId: {
      type: String,
      default: null
    },
    razorpaySignature: {
      type: String,
      default: null
    }
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: ['Order Received', 'In Kitchen', 'Sent to Delivery'],
    default: 'Order Received'
  }
}, {
  timestamps: true
});

export default mongoose.model('Order', orderSchema);