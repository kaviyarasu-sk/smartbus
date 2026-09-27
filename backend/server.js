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

  // Auto-seed if database is completely empty
  const adminExists = await User.findOne({ email: 'admin@college.edu' });
  if (!adminExists) {
    console.log('Seeding demo data into database...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const admin = await User.create({ name: 'System Admin', email: 'admin@college.edu', password: hashedPassword, role: 'ADMIN' });
    const driver1 = await User.create({ name: 'Kumar Driver', email: 'driver@college.edu', password: hashedPassword, role: 'DRIVER', phone: '9876543210' });
    const driver2 = await User.create({ name: 'Ravi Driver', email: 'driver2@college.edu', password: hashedPassword, role: 'DRIVER', phone: '9876543211' });

    // Seed 8 comprehensive real-world routes with many stops
    const route1 = await Route.create({
      routeName: 'Pollachi (City Center) to College Campus',
      routeNumber: 'R1',
      startPoint: 'Pollachi City Center',
      destination: 'College Main Campus Gate',
      stops: ['Pollachi Bus Stand', 'Kovilpalayam Junction', 'Kinathukadavu', 'Eachanari', 'Sundarapuram', 'Ganapathy', 'College Main Campus Gate'],
      distance: 48,
      estimatedDuration: 75,
    });

    const route2 = await Route.create({
      routeName: 'Coimbatore Central to College Campus',
      routeNumber: 'R2',
      startPoint: 'Coimbatore Central Bus Station',
      destination: 'College Main Campus Gate',
      stops: ['Gandhipuram', 'Town Hall', 'Coimbatore Railway Station', 'Ukkadam', 'Peelamedu', 'Avinashi Road', 'College Main Campus Gate'],
      distance: 22,
      estimatedDuration: 40,
    });

    const route3 = await Route.create({
      routeName: 'Tirupur to College Campus',
      routeNumber: 'R3',
      startPoint: 'Tirupur Bus Stand',
      destination: 'College Main Campus Gate',
      stops: ['Tirupur Town', 'Avinashi', 'Annur', 'Sulur', 'Nava India', 'Saravanampatti', 'College Main Campus Gate'],
      distance: 55,
      estimatedDuration: 90,
    });

    const route4 = await Route.create({
      routeName: 'Palakkad to College Campus',
      routeNumber: 'R4',
      startPoint: 'Palakkad Bus Stand',
      destination: 'College Main Campus Gate',
      stops: ['Palakkad Town', 'Walayar', 'Kanjikode', 'Vadakkencherry', 'Chittur', 'Ottapalam', 'Coimbatore', 'College Main Campus Gate'],
      distance: 80,
      estimatedDuration: 120,
    });

    const route5 = await Route.create({
      routeName: 'Erode to College Campus',
      routeNumber: 'R5',
      startPoint: 'Erode Bus Stand',
      destination: 'College Main Campus Gate',
      stops: ['Erode Town', 'Perundurai', 'Ingur', 'Bhavani', 'Mettupalayam Road', 'Kalapatti', 'College Main Campus Gate'],
      distance: 70,
      estimatedDuration: 100,
    });

    const route6 = await Route.create({
      routeName: 'Mettupalayam to College Campus',
      routeNumber: 'R6',
      startPoint: 'Mettupalayam Bus Stand',
      destination: 'College Main Campus Gate',
      stops: ['Mettupalayam Town', 'Karamadai', 'Thadagam', 'Perur', 'Singanallur', 'CHIL IT Park', 'College Main Campus Gate'],
      distance: 38,
      estimatedDuration: 60,
    });

    const route7 = await Route.create({
      routeName: 'Udumalpet to College Campus',
      routeNumber: 'R7',
      startPoint: 'Udumalpet Bus Stand',
      destination: 'College Main Campus Gate',
      stops: ['Udumalpet Town', 'Dharapuram', 'Kangeyam', 'Palladam', 'Tirupur South', 'Kinathukadavu', 'College Main Campus Gate'],
      distance: 90,
      estimatedDuration: 130,
    });

    const route8 = await Route.create({
      routeName: 'Saravanampatti to College Campus',
      routeNumber: 'R8',
      startPoint: 'Saravanampatti Bus Stop',
      destination: 'College Main Campus Gate',
      stops: ['CHIL SEZ', 'Kalapatti Cross', 'Peelamedu', 'Hope College', 'Singanallur', 'Ondipudur', 'College Main Campus Gate'],
      distance: 15,
      estimatedDuration: 30,
    });

    // Create buses assigned to routes
    await Bus.create({ busNumber: 'Bus 101', registrationNumber: 'TN-43-A-1001', capacity: 52, driver: driver1._id, route: route1._id, status: 'ON TIME' });
    await Bus.create({ busNumber: 'Bus 202', registrationNumber: 'TN-43-B-2002', capacity: 48, driver: driver2._id, route: route2._id, status: 'ON TIME' });
    await Bus.create({ busNumber: 'Bus 303', registrationNumber: 'TN-43-C-3003', capacity: 50, driver: driver1._id, route: route3._id, status: 'INACTIVE' });
    await Bus.create({ busNumber: 'Bus 404', registrationNumber: 'TN-43-D-4004', capacity: 45, driver: driver2._id, route: route4._id, status: 'ON TIME' });

    console.log('✅ Demo data seeded successfully!');
    console.log('📧 Login: admin@college.edu | Password: password123');
  }

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`🚌 SmartBus Server running on port ${PORT}`));
};

startServer();
