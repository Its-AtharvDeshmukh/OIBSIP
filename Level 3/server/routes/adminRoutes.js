import express from 'express';
import {
  loginAdmin,
  getAllOrders,
  updateOrderStatus,
  getAdminInventory,
  updateInventoryStock
} from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { getAllStudents, createStudent, updateStudentStatus } from '../controllers/adminStudentController.js';

const router = express.Router();

// Public Admin Authentication Route
router.post('/login', loginAdmin);

// Protected Admin Management Routes
router.get('/orders', protectAdmin, getAllOrders);
router.patch('/orders/:id/status', protectAdmin, updateOrderStatus);
router.get('/inventory', protectAdmin, getAdminInventory);
router.put('/inventory/:id', protectAdmin, updateInventoryStock);

// Student Management Routes
router.get('/students', protectAdmin, getAllStudents);
router.post('/students', protectAdmin, createStudent);
router.patch('/students/:id/status', protectAdmin, updateStudentStatus);

// NOTE: Menu management (/menu) routes are handled exclusively in adminMenuRoutes.js 
// mounted at /api/admin/menu to prevent route shadowing and ensure Cloudinary multipart/form-data support.

export default router;