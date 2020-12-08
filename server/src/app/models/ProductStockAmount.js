import Sequelize, { Model } from 'sequelize';

class ProductStockAmount extends Model {
  static init(sequelize) {
    super.init(
      {
        amount: Sequelize.DECIMAL(15, 2),
      },
      {
        tableName: 'product_stock_amount',
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
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

export default ProductStockAmount;
