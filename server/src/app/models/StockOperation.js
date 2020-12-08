import Sequelize, { Model } from 'sequelize';

class StockOperation extends Model {
  static init(sequelize) {
    super.init(
      {
        type: Sequelize.CHAR(1),
        date: Sequelize.DATE,
        total_amount: Sequelize.INTEGER,
        canceled: Sequelize.BOOLEAN,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    this.belongsTo(models.User, {
      foreignKey: 'cancelation_user_id',
      as: 'cancelation_user',
    });
    this.belongsTo(models.Sale, {
      foreignKey: 'sale_id',
      as: 'sale',
    });
    this.hasMany(models.StockOperationProduct, {
      foreignKey: 'stock_operation_id',
      as: 'products',
    });
  }
}

export default StockOperation;
