import { sequelize } from '../utils/db.js';
import { DataTypes } from 'sequelize';
import { Product } from './product.model.js';
import { User } from './user.model.js';

const InventoryUpdate = sequelize.define('InventoryUpdate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Product, key: 'id' },
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: User, key: 'id' },
  },
  old_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  new_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  change_description: {
    type: DataTypes.STRING(255),
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'inventory_updates',
  timestamps: false,
  indexes: [
    { fields: ['product_id'] },
    { fields: ['user_id'] }
  ]
});

Product.hasMany(InventoryUpdate, { foreignKey: 'product_id' });
InventoryUpdate.belongsTo(Product, { foreignKey: 'product_id' });

User.hasMany(InventoryUpdate, { foreignKey: 'user_id' });
InventoryUpdate.belongsTo(User, { foreignKey: 'user_id' });

export { InventoryUpdate }; 