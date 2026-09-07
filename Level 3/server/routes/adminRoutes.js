import express from 'express';
import {
  loginAdmin,
  getAllOrders,
  updateOrderStatus,
  getAdminInventory,
  updateInventoryStock
} from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Admin Authentication Route
router.post('/login', loginAdmin);

// Protected Admin Management Routes
router.get('/orders', protectAdmin, getAllOrders);
router.patch('/orders/:id/status', protectAdmin, updateOrderStatus);
router.get('/inventory', protectAdmin, getAdminInventory);
router.put('/inventory/:id', protectAdmin, updateInventoryStock);

export default router;