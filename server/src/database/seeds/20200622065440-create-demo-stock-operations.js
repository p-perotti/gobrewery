const datefns = require('date-fns');

module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'stock_operations',
      [
        {
          type: 'E',
          date: datefns.subDays(new Date(), 6),
          user_id: 1,
          total_amount: 370,
          created_at: datefns.subDays(new Date(), 6),
          updated_at: datefns.subDays(new Date(), 6),
        },
        {
          type: 'E',
          date: datefns.subDays(new Date(), 5),
          user_id: 1,
          total_amount: 50,
          created_at: datefns.subDays(new Date(), 5),
          updated_at: datefns.subDays(new Date(), 5),
        },
        {
          type: 'E',
          date: datefns.subDays(new Date(), 5),
          user_id: 1,
          total_amount: 50,
          created_at: datefns.subDays(new Date(), 5),
          updated_at: datefns.subDays(new Date(), 5),
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
