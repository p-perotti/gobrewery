module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('customers', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.CHAR(1),
        allowNull: false,
      },
      cpf: {
        type: Sequelize.STRING(14),
      },
      cnpj: {
        type: Sequelize.STRING(18),
      },
      rg: {
        type: Sequelize.STRING(20),
      },
      ie: {
        type: Sequelize.STRING(20),
      },
      birth_date: {
        type: Sequelize.DATEONLY,
      },
      sex: {
        type: Sequelize.CHAR(1),
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('customers');
  },
};
