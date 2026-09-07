import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Order from '../models/Order.js';
import InventoryItem from '../models/InventoryItem.js';

const generateAdminToken = (id) => {
  return jwt.sign({ id, role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc   Admin login
// @route  POST /api/admin/login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide admin email and password.' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    const token = generateAdminToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Admin authenticated successfully!',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get all customer orders
// @route  GET /api/admin/orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update order status & broadcast change in real time via Socket.io
// @route  PATCH /api/admin/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Order Received', 'In Kitchen', 'Sent to Delivery'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    order.orderStatus = status;
    await order.save();

    // Broadcast real-time update via Socket.io
    const io = req.app.get('io');
    if (io) {
      // Emit to room dedicated to this order
      io.to(`order_${order._id}`).emit('orderStatusUpdated', {
        orderId: order._id,
        orderStatus: order.orderStatus,
        updatedAt: order.updatedAt
      });

      // Also broadcast globally for admin dashboard live charts
      io.emit('adminOrderUpdated', {
        orderId: order._id,
        orderStatus: order.orderStatus
      });
    }

    res.status(200).json({
      success: true,
      message: `Order status successfully transitioned to "${status}"`,
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get all inventory items with calculated stock health
// @route  GET /api/admin/inventory
export const getAdminInventory = async (req, res) => {
  try {
    const items = await InventoryItem.find().sort({ category: 1, name: 1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Manually update stock level or threshold for an inventory item
// @route  PUT /api/admin/inventory/:id
export const updateInventoryStock = async (req, res) => {
  try {
    const { stock, threshold, price } = req.body;

    const item = await InventoryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found.' });
    }

    if (stock !== undefined) {
      if (Number(stock) < 0) {
        return res.status(400).json({ success: false, message: 'Stock level cannot be negative.' });
      }
      item.stock = Number(stock);
    }

    if (threshold !== undefined) {
      item.threshold = Number(threshold);
    }

    if (price !== undefined) {
      item.price = Number(price);
    }

    // Reset email notification timestamp if stock is replenished above threshold
    if (item.stock > item.threshold) {
      item.lastEmailNotifiedAt = null;
    }

    await item.save();

    res.status(200).json({
      success: true,
      message: `Stock updated for ${item.name}.`,
      data: item
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};