const datefns = require('date-fns');

module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'inventory_operations',
      [
        {
          type: 'E',
          date: datefns.subDays(new Date(), 5),
          user_id: 1,
          total_amount: 180,
          created_at: datefns.subDays(new Date(), 5),
          updated_at: datefns.subDays(new Date(), 5),
        },
        {
          type: 'E',
          date: datefns.subDays(new Date(), 3),
          user_id: 1,
          total_amount: 50,
          created_at: datefns.subDays(new Date(), 3),
          updated_at: datefns.subDays(new Date(), 3),
        },
        {
          type: 'E',
          date: datefns.subDays(new Date(), 1),
          user_id: 1,
          total_amount: 50,
          created_at: datefns.subDays(new Date(), 1),
          updated_at: datefns.subDays(new Date(), 1),
        },
        {
          type: 'E',
          date: new Date(),
          user_id: 1,
          total_amount: 90,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
