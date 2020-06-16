import Sequelize, { Model } from 'sequelize';

class InventoryOperation extends Model {
  static init(sequelize) {
    super.init(
      {
        type: Sequelize.CHAR(1),
        date: Sequelize.DATE,
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
  }
}

export default InventoryOperation;
