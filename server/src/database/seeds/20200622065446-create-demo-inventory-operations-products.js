const datefns = require('date-fns');

module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'inventory_operations_products',
      [
        {
          inventory_operation_id: 1,
          product_id: 2,
          size_id: 2,
          amount: 240,
          created_at: datefns.subDays(new Date(), 5),
          updated_at: datefns.subDays(new Date(), 5),
        },
        {
          inventory_operation_id: 1,
          product_id: 2,
          size_id: 3,
          amount: 120,
          created_at: datefns.subDays(new Date(), 5),
          updated_at: datefns.subDays(new Date(), 5),
        },
        {
          inventory_operation_id: 1,
          product_id: 2,
          size_id: 7,
          amount: 10,
          created_at: datefns.subDays(new Date(), 5),
          updated_at: datefns.subDays(new Date(), 5),
        },
        {
          inventory_operation_id: 2,
          product_id: 5,
          size_id: 7,
          amount: 50,
          created_at: datefns.subDays(new Date(), 3),
          updated_at: datefns.subDays(new Date(), 3),
        },
        {
          inventory_operation_id: 3,
          product_id: 6,
          size_id: 7,
          amount: 50,
          created_at: datefns.subDays(new Date(), 1),
          updated_at: datefns.subDays(new Date(), 1),
        },
        {
          inventory_operation_id: 4,
          product_id: 2,
          size_id: 2,
          amount: 60,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          inventory_operation_id: 4,
          product_id: 2,
          size_id: 3,
          amount: 30,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
