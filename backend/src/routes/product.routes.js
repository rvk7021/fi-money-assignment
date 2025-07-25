import { Router } from 'express';
import { addProduct, updateProductQuantity, getProducts } from '../controllers/product.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - sku
 *               - quantity
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               sku:
 *                 type: string
 *               image_url:
 *                 type: string
 *               description:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product added successfully
 *       409:
 *         description: SKU already exists
 *       400:
 *         description: Missing required fields
 */
router.post('/', verifyToken, addProduct);

/**
 * @swagger
 * /products/{id}/quantity:
 *   put:
 *     summary: Update product quantity
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Quantity updated successfully
 *       404:
 *         description: Product not found
 *       400:
 *         description: Invalid quantity
 */
router.put('/:id/quantity', verifyToken, updateProductQuantity);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get paginated list of products
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of products per page
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', verifyToken, getProducts);

// Compatibility aliases for test script (no /api prefix)
router.post('/products', verifyToken, addProduct);
router.put('/products/:id/quantity', verifyToken, updateProductQuantity);
router.get('/products', verifyToken, getProducts);

export default router; 