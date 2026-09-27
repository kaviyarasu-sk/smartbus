import mongoose from 'mongoose';
const tripSchema = new mongoose.Schema({
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  startTime: { type: Date },
  endTime: { type: Date },
  status: { type: String, enum: ['ACTIVE', 'COMPLETED', 'PENDING'], default: 'PENDING' },
  locationHistory: [{
    lat: Number,
    lng: Number,
    timestamp: Date
  }]
}, { timestamps: true });
export default mongoose.model('Trip', tripSchema);
