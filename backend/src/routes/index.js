import express from 'express';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import { sequelize } from '../utils/db.js';

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'disconnected', error: err.message });
  }
});

router.use('/auth', authRoutes);
router.use('/products', productRoutes);

export default router; 