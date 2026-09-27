const fs = require('fs');
const path = require('path');

const files = {
    'middleware/authMiddleware.js': `import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
`,
    'controllers/authController.js': `import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  const { name, email, password, role, phone, studentId, department, licenseNumber } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name, email, password: hashedPassword, role: role || 'STUDENT',
      phone, studentId, department, licenseNumber
    });

    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id, name: user.name, email: user.email, role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
`,
    'routes/authRoutes.js': `import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
`
};

for (const [filepath, content] of Object.entries(files)) {
    const fullPath = path.join('c:/Users/nss/Downloads/New folder/web/smart-bus-tracking/backend', filepath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
}

// Update server.js
const serverPath = 'c:/Users/nss/Downloads/New folder/web/smart-bus-tracking/backend/server.js';
let serverCode = fs.readFileSync(serverPath, 'utf8');
serverCode = serverCode.replace(
  "// Auth routes placeholder\napp.use('/api/auth', (req, res) => res.json({ token: 'demo-token', user: { role: 'ADMIN', name: 'Demo Admin' } }));",
  "import authRoutes from './routes/authRoutes.js';\napp.use('/api/auth', authRoutes);"
);
fs.writeFileSync(serverPath, serverCode);
