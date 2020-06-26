import Sequelize, { Model } from 'sequelize';

class Sale extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        status: Sequelize.CHAR(1),
        total_amount: Sequelize.INTEGER,
        gross_total: Sequelize.DECIMAL(15, 2),
        net_total: Sequelize.DECIMAL(15, 2),
        total_discount: Sequelize.DECIMAL(15, 2),
        canceled: Sequelize.BOOLEAN,
        canceled_at: Sequelize.BOOLEAN,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer',
    });
    this.belongsTo(models.Coupon, {
      foreignKey: 'coupon_id',
      as: 'coupon',
    });
    this.belongsTo(models.PaymentMethod, {
      foreignKey: 'payment_method_id',
      as: 'payment_method',
    });
  }
}

export default Sale;
