module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'products_prices',
      [
        {
          product_id: 2,
          size_id: 2,
          description: '2020/1',
          starting_date: '2020-07-01T03:00:00.000Z',
          expiration_date: '2021-01-01T02:59:59.999Z',
          price: 2.99,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          product_id: 2,
          size_id: 3,
          description: '2020/1',
          starting_date: '2020-07-01T03:00:00.000Z',
          expiration_date: '2021-01-01T02:59:59.999Z',
          price: 3.19,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          product_id: 5,
          size_id: 7,
          description: '2020/1',
          starting_date: '2020-07-01T03:00:00.000Z',
          expiration_date: '2021-01-01T02:59:59.999Z',
          price: 9.99,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          product_id: 6,
          size_id: 7,
          description: '2020/1',
          starting_date: '2020-07-01T03:00:00.000Z',
          expiration_date: '2021-01-01T02:59:59.999Z',
          price: 9.99,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          product_id: 2,
          size_id: 7,
          description: '2020/1',
          starting_date: '2020-07-01T03:00:00.000Z',
          expiration_date: '2021-01-01T02:59:59.999Z',
          price: 9.99,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
