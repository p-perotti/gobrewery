module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('coupons', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
      starting_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      expiration_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      type: {
        type: Sequelize.CHAR(1),
        allowNull: false,
      },
      value: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      discount_limitation: {
        type: Sequelize.DECIMAL(15, 2),
      },
      use_limit: {
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('coupons');
  },
};
