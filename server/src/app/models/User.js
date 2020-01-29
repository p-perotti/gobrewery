import Sequelize, { Model } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        name: Sequelize.STRING,
        type: Sequelize.STRING,
        cpf: Sequelize.STRING,
        cnpj: Sequelize.STRING,
        rg: Sequelize.STRING,
        ie: Sequelize.STRING,
        birthdate: Sequelize.DATEONLY,
        sex: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }
}

export default User;
