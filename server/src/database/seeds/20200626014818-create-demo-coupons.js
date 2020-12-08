const datefns = require('date-fns');

module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'coupons',
      [
        {
          name: 'ESTREIA',
          description: 'R$10,00 de desconto na estreia das vendas.',
          starting_date: datefns.startOfDay(datefns.subDays(new Date(), 6)),
          expiration_date: datefns.endOfDay(datefns.subDays(new Date(), 6)),
          type: 'V',
          value: 10,
          use_limit: 10,
          created_at: datefns.subDays(new Date(), 6),
          updated_at: datefns.subDays(new Date(), 6),
        },
        {
          name: 'FESTA',
          description: '15% de desconto.',
          starting_date: datefns.startOfDay(new Date()),
          expiration_date: datefns.endOfDay(new Date()),
          type: 'P',
          value: 15,
          discount_limitation: 15,
          use_limit: 50,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
