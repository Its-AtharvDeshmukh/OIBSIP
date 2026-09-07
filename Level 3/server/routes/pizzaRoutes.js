import express from 'express';
import { getPizzas, getPizzaById } from '../controllers/pizzaController.js';

const router = express.Router();

router.get('/', getPizzas);
router.get('/:id', getPizzaById);

export default router;