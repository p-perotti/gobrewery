module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('sales', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'customers', key: 'id' },
      },
      status: {
        type: Sequelize.CHAR(1),
        allowNull: false,
      },
      total_amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      gross_total: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      net_total: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      coupon_id: {
        type: Sequelize.INTEGER,
        references: { model: 'coupons', key: 'id' },
      },
      total_discount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      payment_method_id: {
        type: Sequelize.INTEGER,
        references: { model: 'payment_methods', key: 'id' },
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
    return queryInterface.dropTable('sales');
  },
};
