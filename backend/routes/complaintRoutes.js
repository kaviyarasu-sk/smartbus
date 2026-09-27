import express from 'express';
import { getComplaints, createComplaint, updateComplaint } from '../controllers/complaintController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/').get(protect, getComplaints).post(protect, createComplaint);
router.route('/:id').put(protect, updateComplaint);
export default router;
