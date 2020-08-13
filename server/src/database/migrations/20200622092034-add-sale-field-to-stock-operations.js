module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('stock_operations', 'sale_id', {
      type: Sequelize.INTEGER,
      references: { model: 'sales', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('stock_operations', 'sale_id');
  },
};
