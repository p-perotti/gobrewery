module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'product_stock_amount',
      [
        {
          product_id: 2,
          size_id: 2,
          amount: 100,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          product_id: 2,
          size_id: 3,
          amount: 30,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          product_id: 2,
          size_id: 7,
          amount: 9,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          product_id: 5,
          size_id: 7,
          amount: 20,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          product_id: 6,
          size_id: 7,
          amount: 40,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
