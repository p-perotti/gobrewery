module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('products_prices', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'products', key: 'id' },
      },
      size_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'sizes', key: 'id' },
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      starting_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      expiration_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(15, 2),
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
    return queryInterface.dropTable('products_prices');
  },
};
