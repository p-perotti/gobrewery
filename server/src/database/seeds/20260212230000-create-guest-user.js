const bcrypt = require('bcryptjs');

module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'users',
      [
        {
          email: 'guest@gobrewery.com',
          password_hash: bcrypt.hashSync('gobrewery', 8),
          name: 'Guest',
          administrator: false,
          guest: true,
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
