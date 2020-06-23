import Sequelize, { Model } from 'sequelize';

class Size extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
        capacity: Sequelize.NUMERIC(7, 3),
        active: Sequelize.BOOLEAN,
      },
      { sequelize }
    );

    return this;
  }
}

export default Size;
