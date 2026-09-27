import express from 'express';
import { getBuses, addBus, updateBus, deleteBus } from '../controllers/busController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getBuses)
  .post(protect, addBus);

router.route('/:id')
  .put(protect, updateBus)
  .delete(protect, deleteBus);

export default router;
