import { sequelize } from '../utils/db.js';
import { DataTypes } from 'sequelize';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  sku: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
  type: DataTypes.STRING(100),
  description: DataTypes.TEXT,
  image_url: DataTypes.STRING(2048),
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'products',
  timestamps: false,
});

export const insertProduct = async (productData) => {
  const product = await Product.create(productData);
  return product.id;
};

export { Product }; 