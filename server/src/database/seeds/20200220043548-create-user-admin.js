const bcrypt = require('bcryptjs');

module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'users',
      [
        {
          email: 'admin@gobrewery.com',
          password_hash: bcrypt.hashSync('admin', 8),
          name: 'Administrator',
          administrator: true,
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
