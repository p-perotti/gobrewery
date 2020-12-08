import Sequelize, { Model } from 'sequelize';

class SaleProduct extends Model {
  static init(sequelize) {
    super.init(
      {
        amount: Sequelize.INTEGER,
        unit_price: Sequelize.DECIMAL(15, 2),
        price: Sequelize.DECIMAL(15, 2),
      },
      {
        tableName: 'sales_products',
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Sale, {
      foreignKey: 'sale_id',
      as: 'sale',
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

export default SaleProduct;
