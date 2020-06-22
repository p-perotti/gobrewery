module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('inventory_operations_products', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      inventory_operation_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'inventory_operations', key: 'id' },
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
    return queryInterface.dropTable('inventory_operations_products');
  },
};
