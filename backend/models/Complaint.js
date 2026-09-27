import mongoose from 'mongoose';
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
