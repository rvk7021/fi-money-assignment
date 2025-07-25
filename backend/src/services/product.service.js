import { insertProduct, Product } from '../models/product.model.js';
import { InventoryUpdate } from '../models/inventory-update.model.js';

export const createProduct = async (productData) => {
  return await insertProduct(productData);
};

export const updateQuantity = async ({ productId, quantity, userId }) => {
  const product = await Product.findByPk(productId);
  if (!product) return null;
  const oldQuantity = product.quantity;
  await product.update({ quantity });
  await InventoryUpdate.create({
    product_id: productId,
    user_id: userId,
    old_quantity: oldQuantity,
    new_quantity: quantity,
    change_description: `Quantity updated from ${oldQuantity} to ${quantity}`,
  });
  return product;
};

export const fetchProducts = async ({ page, limit }) => {
  const offset = (page - 1) * limit;
  const { rows: products, count: total } = await Product.findAndCountAll({
    offset,
    limit,
    order: [['created_at', 'DESC']]
  });
  return { products, total };
}; 