module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'product_inventory_amount',
      [
        {
          product_id: 2,
          size_id: 2,
          amount: 52,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          product_id: 2,
          size_id: 3,
          amount: 6,
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
