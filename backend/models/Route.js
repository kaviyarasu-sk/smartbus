import mongoose from 'mongoose';
const routeSchema = new mongoose.Schema({
  routeName: { type: String, required: true },
  routeNumber: { type: String, required: true },
  startPoint: { type: String, required: true },
  destination: { type: String, required: true },
  stops: [{ type: String }],
  distance: { type: Number },
  estimatedDuration: { type: Number }
}, { timestamps: true });
export default mongoose.model('Route', routeSchema);
