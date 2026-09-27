const fs = require('fs');
const path = require('path');

const backendFiles = {
    'models/Bus.js': `import mongoose from 'mongoose';
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
`,
    'models/Route.js': `import mongoose from 'mongoose';
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
`,
    'models/Trip.js': `import mongoose from 'mongoose';
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
`,
    'config/db.js': `import mongoose from 'mongoose';
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-bus');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
`,
    'server.js': `import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Auth routes placeholder
app.use('/api/auth', (req, res) => res.json({ token: 'demo-token', user: { role: 'ADMIN', name: 'Demo Admin' } }));

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
`,
    'package.json': `{
  "name": "backend",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.3.2",
    "socket.io": "^4.7.5"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
`
};

for (const [filepath, content] of Object.entries(backendFiles)) {
    const fullPath = path.join('c:/Users/nss/Downloads/New folder/web/smart-bus-tracking/backend', filepath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
}
