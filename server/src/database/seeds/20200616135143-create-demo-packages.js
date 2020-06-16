module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'sizes',
      [
        {
          description: 'Lata 269ml',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Lata 350ml',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Long Neck 330ml',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Long Neck 355ml',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Garrafa 600ml',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Garrafa 1L',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Growler 1,5L',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Barril 5L',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Barril 15L',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Barril 30L',
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
