import { createProduct, updateQuantity, fetchProducts } from '../services/product.service.js';

function isCompatProductRoute(req) {
  return req.originalUrl.startsWith('/products');
}

export const addProduct = async (req, res) => {
  const { name, type, sku, image_url, description, quantity, price } = req.body;
  if (!name || !sku || typeof quantity !== 'number' || typeof price !== 'number') {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const productId = await createProduct({ name, type, sku, image_url, description, quantity, price });
    if (isCompatProductRoute(req)) {
      res.status(201).json({ product_id: productId, message: 'Product added successfully' });
    } else {
      res.status(201).json({ id: productId, message: 'Product added successfully' });
    }
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ error: 'SKU already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const updateProductQuantity = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  if (typeof quantity !== 'number' || quantity < 0) {
    return res.status(400).json({ error: 'Quantity must be a non-negative integer' });
  }
  try {
    const updatedProduct = await updateQuantity({ productId: id, quantity, userId: req.user.id });
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (isCompatProductRoute(req)) {
      res.json({ quantity: updatedProduct.quantity });
    } else {
      res.json({ message: 'Quantity updated successfully', product: updatedProduct });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProducts = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  try {
    const { products, total } = await fetchProducts({ page, limit });
    if (req.originalUrl.startsWith('/products')) {
      res.json(products);
    } else {
      res.json({ page, limit, total, products });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}; 