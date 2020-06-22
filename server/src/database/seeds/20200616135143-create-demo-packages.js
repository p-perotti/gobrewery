module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'sizes',
      [
        {
          description: 'Lata 269ml',
          capacity: 269,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Lata 350ml',
          capacity: 350,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Long Neck 330ml',
          capacity: 330,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Long Neck 355ml',
          capacity: 355,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Garrafa 600ml',
          capacity: 600,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Garrafa 1L',
          capacity: 1000,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Growler 1,5L',
          capacity: 1500,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Barril 5L',
          capacity: 5000,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Barril 15L',
          capacity: 15000,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Barril 30L',
          capacity: 30000,
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
