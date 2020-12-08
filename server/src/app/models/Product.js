import Sequelize, { Model } from 'sequelize';

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        barcode: Sequelize.STRING,
        active: Sequelize.BOOLEAN,
      },
      { sequelize }
    );

    return this;
  }
}

export default Product;
