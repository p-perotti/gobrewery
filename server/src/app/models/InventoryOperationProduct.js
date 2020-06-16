import Sequelize, { Model } from 'sequelize';

class InventoryOperationProduct extends Model {
  static init(sequelize) {
    super.init(
      {
        quantity: Sequelize.DECIMAL(15, 2),
      },
      {
        tableName: 'inventory_operations_products',
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.InventoryOperation, {
      foreignKey: 'inventory_operation_id',
      as: 'inventory_operation',
    });
    this.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product',
    });
    this.belongsTo(models.Size, {
      foreignKey: 'size_id',
      as: 'size',
    });
  }
}

export default InventoryOperationProduct;
