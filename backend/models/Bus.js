import mongoose from 'mongoose';
const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  capacity: { type: Number, required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  status: { type: String, enum: ['ON TIME', 'DELAYED', 'INACTIVE', 'COMPLETED'], default: 'INACTIVE' },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  speed: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });
export default mongoose.model('Bus', busSchema);
