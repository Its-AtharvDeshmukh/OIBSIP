import express from 'express';
import { getMyOrders, getOrderById } from '../controllers/orderController.js';
import { protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-orders', protectUser, getMyOrders);
router.get('/:id', protectUser, getOrderById);

export default router;