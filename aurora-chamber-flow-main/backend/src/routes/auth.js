import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validateCrescentEmail } from '../middleware/auth.js';

const router = express.Router();

// In-memory storage for demo (replace with database in production)
const users = [];

// Register/Login for admin (only @crescent.education emails)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email domain
    if (!validateCrescentEmail(email)) {
      return res.status(403).json({ 
        error: 'Access denied. Only @crescent.education email addresses are allowed for admin access.' 
      });
    }

    // For simplicity, auto-create user if doesn't exist (in production, use proper registration)
    let user = users.find(u => u.email === email);
    
    if (!user) {
      // Create new user with hashed password
      const hashedPassword = await bcrypt.hash(password || 'defaultPassword123', 10);
      user = {
        id: users.length + 1,
        email,
        password: hashedPassword,
        createdAt: new Date()
      };
      users.push(user);
    } else {
      // Verify password for existing user
      const validPassword = await bcrypt.compare(password || 'defaultPassword123', user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify token
router.get('/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: verified });
  } catch (error) {
    res.status(403).json({ error: 'Invalid token', valid: false });
  }
});

export default router;
