module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'sizes',
      [
        {
          description: 'Lata 269ml',
          capacity: 0.269,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Lata 350ml',
          capacity: 0.35,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Long Neck 330ml',
          capacity: 0.33,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Long Neck 355ml',
          capacity: 0.355,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Garrafa 600ml',
          capacity: 0.6,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Garrafa 1L',
          capacity: 1,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Growler 1,5L',
          capacity: 1.5,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Barril 5L',
          capacity: 5,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Barril 15L',
          capacity: 15,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Barril 30L',
          capacity: 30,
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
