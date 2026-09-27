import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['STUDENT', 'DRIVER', 'ADMIN'], default: 'STUDENT' },
  phone: { type: String },
  studentId: { type: String },
  department: { type: String },
  licenseNumber: { type: String },
  assignedBus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
