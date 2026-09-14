import express from 'express';
import { getBuilderIngredients } from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/', getBuilderIngredients);

export default router;