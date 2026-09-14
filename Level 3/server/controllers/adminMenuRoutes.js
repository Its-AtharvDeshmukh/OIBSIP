import express from 'express';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';
import { getAdminMenu, createMenuPizza, updateMenuPizza, softDeletePizza } from '../controllers/adminMenuController.js';

const router = express.Router();

router.use(protectAdmin); // Protect all menu routes
router.get('/', getAdminMenu);
router.post('/', upload.single('imageFile'), createMenuPizza);
router.put('/:id', upload.single('imageFile'), updateMenuPizza);
router.delete('/:id', softDeletePizza);

export default router;