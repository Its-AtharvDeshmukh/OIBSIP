import crypto from 'crypto';
import razorpayInstance from '../config/razorpay.js';
import Order from '../models/Order.js';
import InventoryItem from '../models/InventoryItem.js';

// @desc   Validate ingredients, calculate price, create pending Order & Razorpay Order
// @route  POST /api/payment/create-order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { pizzaConfig, customerInfo } = req.body;

    if (!pizzaConfig || !pizzaConfig.base || !pizzaConfig.sauce || !pizzaConfig.cheese) {
      return res.status(400).json({
        success: false,
        message: 'Invalid configuration: Base, Sauce, and Cheese are mandatory.'
      });
    }

    const { base, sauce, cheese, veggies = [] } = pizzaConfig;

    // 1. Fetch ingredients from DB to ensure they exist and have available stock
    const requiredNames = [base, sauce, cheese, ...veggies];
    const items = await InventoryItem.find({ name: { $in: requiredNames } });

    if (items.length !== requiredNames.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more selected ingredients are invalid or unavailable.'
      });
    }

    // 2. Verify stock availability (must be > 0)
    for (const item of items) {
      if (item.stock <= 0) {
        return res.status(400).json({
          success: false,
          message: `Ingredient "${item.name}" is currently out of stock. Please adjust your selection.`
        });
      }
    }

    // 3. Compute authentic server-side total amount in INR
    const totalAmount = items.reduce((acc, curr) => acc + curr.price, 0);

    // 4. Create Razorpay Test Order (amount in paise: 1 INR = 100 paise)
    const options = {
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: `rcpt_${Date.now().toString().slice(-8)}`
    };

    let razorpayOrder;
    try {
      razorpayOrder = await razorpayInstance.orders.create(options);
    } catch (rzpErr) {
      return res.status(500).json({
        success: false,
        message: `Razorpay Order Creation Failed: ${rzpErr.message}. Ensure your test keys are valid in server/.env.`
      });
    }

    // 5. Create pending Order record in MongoDB
    const order = await Order.create({
      user: req.user._id,
      customerInfo: customerInfo || {
        name: req.user.name,
        email: req.user.email,
        address: 'Standard Delivery Address',
        phone: '9999999999'
      },
      pizzaConfig: {
        base,
        sauce,
        cheese,
        veggies
      },
      totalAmount,
      paymentDetails: {
        razorpayOrderId: razorpayOrder.id
      },
      paymentStatus: 'Pending',
      orderStatus: 'Order Received'
    });

    res.status(201).json({
      success: true,
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      totalAmount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Verify Razorpay payment signature & atomically decrement inventory
// @route  POST /api/payment/verify
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Incomplete payment verification payload.'
      });
    }

    // 1. Cryptographic HMAC SHA256 verification
    const bodyData = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(bodyData)
      .digest('hex');

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order record not found.' });
    }

    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = 'Failed';
      await order.save();
      return res.status(400).json({
        success: false,
        message: 'Security Alert: Payment signature verification failed. Untrusted response.'
      });
    }

    // 2. Mark order as confirmed and completed
    order.paymentStatus = 'Completed';
    order.orderStatus = 'Order Received';
    order.paymentDetails.razorpayPaymentId = razorpay_payment_id;
    order.paymentDetails.razorpaySignature = razorpay_signature;
    await order.save();

    // 3. ATOMIC BACKEND INVENTORY DEDUCTION
    // Decrement selected base stock
    await InventoryItem.updateOne(
      { name: order.pizzaConfig.base, category: 'base' },
      { $inc: { stock: -1 } }
    );

    // Decrement selected sauce stock
    await InventoryItem.updateOne(
      { name: order.pizzaConfig.sauce, category: 'sauce' },
      { $inc: { stock: -1 } }
    );

    // Decrement selected cheese stock
    await InventoryItem.updateOne(
      { name: order.pizzaConfig.cheese, category: 'cheese' },
      { $inc: { stock: -1 } }
    );

    // Decrement each selected vegetable stock
    if (order.pizzaConfig.veggies && order.pizzaConfig.veggies.length > 0) {
      for (const veggie of order.pizzaConfig.veggies) {
        await InventoryItem.updateOne(
          { name: veggie, category: 'veggie' },
          { $inc: { stock: -1 } }
        );
      }
    }

    console.log(`[INVENTORY]: Decremented stock for Order ${order._id}`);

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully! Order is confirmed and placed in queue.',
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};