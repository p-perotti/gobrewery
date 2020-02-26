import Sequelize, { Model } from 'sequelize';

class Coupon extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        starting_date: Sequelize.DATE,
        expiration_date: Sequelize.DATE,
        type: Sequelize.CHAR(1),
        value: Sequelize.DECIMAL(15, 2),
      },
      { sequelize }
    );

    return this;
  }
}

export default Coupon;
