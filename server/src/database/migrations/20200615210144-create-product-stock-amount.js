module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('product_stock_amount', {
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
      amount: {
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('product_stock_amount');
  },
};
