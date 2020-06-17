import Sequelize, { Model } from 'sequelize';

class ProductInventoryQuantity extends Model {
  static init(sequelize) {
    super.init(
      {
        quantity: Sequelize.DECIMAL(15, 2),
      },
      {
        tableName: 'product_inventory_quantity',
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

export default ProductInventoryQuantity;
