import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Bus from './models/Bus.js';
import Route from './models/Route.js';
import { connectDB } from './config/db.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected for seeding...');

    await User.deleteMany();
    await Bus.deleteMany();
    await Route.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create Admin
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@college.edu',
      password: hashedPassword,
      role: 'ADMIN'
    });

    // Create Driver
    const driver = await User.create({
      name: 'John Driver',
      email: 'driver@college.edu',
      password: hashedPassword,
      role: 'DRIVER',
      phone: '9876543210'
    });

    // Create Route
    const route = await Route.create({
      routeName: 'City Center to Campus',
      routeNumber: 'R1',
      startPoint: 'City Center',
      destination: 'Main Campus',
      stops: ['Stop A', 'Stop B'],
      distance: 15,
      estimatedDuration: 45
    });

    // Create Bus
    await Bus.create({
      busNumber: 'Bus 101',
      registrationNumber: 'TN-43-A-1234',
      capacity: 50,
      driver: driver._id,
      route: route._id,
      status: 'ON TIME'
    });

    console.log('Database seeded successfully! (Note: Since this is an in-memory database, data will reset when the server stops. Leave the server running to test).');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
