module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('products_sizes', {
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: 'products', key: 'id' },
        onDelete: 'CASCADE',
      },
      size_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: 'sizes', key: 'id' },
        onDelete: 'CASCADE',
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('products_sizes');
  },
};
