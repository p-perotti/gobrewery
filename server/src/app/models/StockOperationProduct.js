import Sequelize, { Model } from 'sequelize';

class StockOperationProduct extends Model {
  static init(sequelize) {
    super.init(
      {
        amount: Sequelize.DECIMAL(15, 2),
      },
      {
        tableName: 'stock_operations_products',
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.StockOperation, {
      foreignKey: 'stock_operation_id',
      as: 'stock_operation',
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

export default StockOperationProduct;
