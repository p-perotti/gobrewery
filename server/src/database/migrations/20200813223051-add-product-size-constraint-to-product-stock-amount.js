module.exports = {
  up: queryInterface => {
    return queryInterface.addConstraint('product_stock_amount', {
      fields: ['product_id', 'size_id'],
      type: 'unique',
      name: 'product_size_stock_unique_constraint',
    });
  },

  down: queryInterface => {
    return queryInterface.removeConstraint(
      'product_stock_amount',
      'product_size_stock_unique_constraint'
    );
  },
};
