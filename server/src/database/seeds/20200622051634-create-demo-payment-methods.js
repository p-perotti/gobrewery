module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'payment_methods',
      [
        {
          name: 'Boleto',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Cartão de Crédito',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
