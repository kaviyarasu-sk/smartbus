import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Bus from './models/Bus.js';
import Route from './models/Route.js';
import authRoutes from './routes/authRoutes.js';
import busRoutes from './routes/busRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import setupTracking from './sockets/tracking.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/notifications', notificationRoutes);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected'));
});

setupTracking(io);

const startServer = async () => {
  await connectDB();

  // Auto-seed if database is completely empty (helps with in-memory DB)
  const adminExists = await User.findOne({ email: 'admin@college.edu' });
  if (!adminExists) {
    console.log('Seeding demo data into database...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const admin = await User.create({ name: 'System Admin', email: 'admin@college.edu', password: hashedPassword, role: 'ADMIN' });
    const driver = await User.create({ name: 'John Driver', email: 'driver@college.edu', password: hashedPassword, role: 'DRIVER', phone: '9876543210' });
    const route = await Route.create({ routeName: 'City Center to Campus', routeNumber: 'R1', startPoint: 'City Center', destination: 'Main Campus', stops: ['Stop A', 'Stop B'], distance: 15, estimatedDuration: 45 });
    await Bus.create({ busNumber: 'Bus 101', registrationNumber: 'TN-43-A-1234', capacity: 50, driver: driver._id, route: route._id, status: 'ON TIME' });
    console.log('Demo data seeded. You can log in with admin@college.edu / password123');
  }

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
