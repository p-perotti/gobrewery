import Sequelize, { Model } from 'sequelize';

class Package extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
        active: Sequelize.BOOLEAN,
      },
      { sequelize }
    );

    return this;
  }
}

export default Package;
