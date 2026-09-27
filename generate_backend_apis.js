const fs = require('fs');
const path = require('path');

const backendBase = 'c:/Users/nss/Downloads/New folder/web/smart-bus-tracking/backend';

const files = {
    // Complaint Model
    'models/Complaint.js': `import mongoose from 'mongoose';
const complaintSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Bus Delay', 'Driver Issue', 'Route Issue', 'Technical Issue', 'Other'], default: 'Other' },
  busNumber: { type: String },
  status: { type: String, enum: ['PENDING', 'IN PROGRESS', 'RESOLVED'], default: 'PENDING' },
  adminReply: { type: String }
}, { timestamps: true });
export default mongoose.model('Complaint', complaintSchema);
`,
    // Notification Model
    'models/Notification.js': `import mongoose from 'mongoose';
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'warning', 'success', 'bus'], default: 'info' },
  read: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.model('Notification', notificationSchema);
`,
    // Complaint Controller
    'controllers/complaintController.js': `import Complaint from '../models/Complaint.js';
export const getComplaints = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'STUDENT') query.student = req.user._id;
    const complaints = await Complaint.find(query).populate('student', 'name email').sort('-createdAt');
    res.json(complaints);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
export const createComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create({ ...req.body, student: req.user._id });
    res.status(201).json(complaint);
  } catch (error) { res.status(400).json({ message: error.message }); }
};
export const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(complaint);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
`,
    // Notification Controller
    'controllers/notificationController.js': `import Notification from '../models/Notification.js';
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort('-createdAt');
    res.json(notifications);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
export const markRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(notification);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
`,
    // Complaint Routes
    'routes/complaintRoutes.js': `import express from 'express';
import { getComplaints, createComplaint, updateComplaint } from '../controllers/complaintController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/').get(protect, getComplaints).post(protect, createComplaint);
router.route('/:id').put(protect, updateComplaint);
export default router;
`,
    // Notification Routes
    'routes/notificationRoutes.js': `import express from 'express';
import { getNotifications, markRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/').get(protect, getNotifications);
router.route('/:id/read').put(protect, markRead);
export default router;
`,
};

for (const [filepath, content] of Object.entries(files)) {
    const fullPath = path.join(backendBase, filepath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
}

// Update server.js to register complaint and notification routes
const serverPath = path.join(backendBase, 'server.js');
let serverCode = fs.readFileSync(serverPath, 'utf8');
if (!serverCode.includes('complaintRoutes')) {
    serverCode = serverCode.replace(
        "import routeRoutes from './routes/routeRoutes.js';",
        "import routeRoutes from './routes/routeRoutes.js';\nimport complaintRoutes from './routes/complaintRoutes.js';\nimport notificationRoutes from './routes/notificationRoutes.js';"
    );
    serverCode = serverCode.replace(
        "app.use('/api/routes', routeRoutes);",
        "app.use('/api/routes', routeRoutes);\napp.use('/api/complaints', complaintRoutes);\napp.use('/api/notifications', notificationRoutes);"
    );
    fs.writeFileSync(serverPath, serverCode);
}

console.log('Backend APIs for Complaints & Notifications created successfully!');
