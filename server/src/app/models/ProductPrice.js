import Sequelize, { Model } from 'sequelize';

class ProductPrice extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
        starting_date: Sequelize.DATE,
        expiration_date: Sequelize.DATE,
        price: Sequelize.DECIMAL(15, 2),
      },
      {
        tableName: 'products_prices',
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
  }
}

export default ProductPrice;
