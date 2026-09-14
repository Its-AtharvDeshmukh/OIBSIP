import express from 'express';
import { getPizzas, getPizzaById, createPizza, deletePizza } from '../controllers/pizzaController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes for customers
router.get('/', getPizzas);
router.get('/:id', getPizzaById);

// Protected routes for Restaurant Admin
router.post('/', protectAdmin, createPizza);
router.delete('/:id', protectAdmin, deletePizza);

export default router;