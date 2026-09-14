import express from 'express';
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/paymentController.js';
import { protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protectUser, createRazorpayOrder);
router.post('/verify', protectUser, verifyRazorpayPayment);

export default router;