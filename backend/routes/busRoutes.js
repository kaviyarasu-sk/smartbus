import express from 'express';
import { getBuses, addBus, deleteBus } from '../controllers/busController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/').get(protect, getBuses).post(protect, addBus);
router.route('/:id').delete(protect, deleteBus);
export default router;
