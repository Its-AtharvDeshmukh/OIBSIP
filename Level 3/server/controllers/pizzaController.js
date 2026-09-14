import Pizza from '../models/Pizza.js';

// @desc   Get all available menu pizzas
// @route  GET /api/pizzas
export const getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find({ isAvailable: true });
    res.status(200).json({ success: true, count: pizzas.length, data: pizzas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get single pizza by ID
// @route  GET /api/pizzas/:id
export const getPizzaById = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }
    res.status(200).json({ success: true, data: pizza });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create a new menu pizza
// @route  POST /api/pizzas
// @access Private/Admin
export const createPizza = async (req, res) => {
  try {
    const { name, description, price, image, defaultConfig } = req.body;
    
    const pizza = await Pizza.create({
      name,
      description,
      price,
      image,
      defaultConfig
    });

    res.status(201).json({ success: true, data: pizza });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete a pizza
// @route  DELETE /api/pizzas/:id
// @access Private/Admin
export const deletePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    
    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }

    await pizza.deleteOne();
    res.status(200).json({ success: true, message: 'Pizza removed from menu' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  try {
    // 1. Verify HMAC Signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // 2. IDEMPOTENCY CHECK: Do not process twice
    if (order.paymentStatus === 'Completed') {
      return res.status(200).json({ success: true, message: 'Payment already processed' });
    }

    // 3. Mark Order as Completed
    order.paymentStatus = 'Completed';
    order.orderStatus = 'Order Received';
    order.transactionId = razorpay_payment_id;
    await order.save();

    // 4. ATOMIC INVENTORY DECREMENT
    // Using $inc ensures stock never goes negative safely at the DB level
    const { base, sauce, cheese, veggies } = order.pizzaConfig;
    const itemsToDecrement = [base, sauce, cheese, ...veggies].filter(Boolean);
    
    await Promise.all(itemsToDecrement.map(async (itemName) => {
      await Inventory.findOneAndUpdate(
        { name: itemName, stock: { $gt: 0 } }, 
        { $inc: { stock: -1 } }
      );
    }));

    // Trigger Socket.IO if needed
    // io.to(`order_${order._id}`).emit('orderStatusUpdated', { ... });

    res.status(200).json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during verification' });
  }
};