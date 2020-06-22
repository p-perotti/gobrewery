import Sequelize, { Model } from 'sequelize';

class PaymentMethod extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        active: Sequelize.BOOLEAN,
      },
      { sequelize }
    );

    return this;
  }
}

export default PaymentMethod;
