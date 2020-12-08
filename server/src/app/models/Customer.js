import Sequelize, { Model } from 'sequelize';

class Customer extends Model {
  static init(sequelize) {
    super.init(
      {
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        name: Sequelize.STRING,
        type: Sequelize.CHAR(1),
        cpf: Sequelize.STRING(14),
        cnpj: Sequelize.STRING(18),
        rg: Sequelize.STRING(20),
        ie: Sequelize.STRING(20),
        birth_date: Sequelize.DATEONLY,
        active: Sequelize.BOOLEAN,
      },
      { sequelize }
    );

    return this;
  }
}

export default Customer;
