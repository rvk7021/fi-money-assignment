import { findByUsername, createUser } from '../services/user.service.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 60 * 60 * 1000,
};

function isCompatRoute(req) {
  return req.originalUrl === '/login' || req.originalUrl === '/register';
}

export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  try {
    const user = await findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.cookie('access_token', token, COOKIE_OPTIONS);
    if (isCompatRoute(req)) {
      res.json({ message: 'Login successful', access_token: token });
    } else {
      res.json({ message: 'Login successful' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const signup = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  try {
    const existingUser = await findByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const userId = await createUser({ username, password_hash });
    if (isCompatRoute(req)) {
      res.status(201).json({ user_id: userId, message: 'User created successfully' });
    } else {
      res.status(201).json({ id: userId, message: 'User created successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}; 