const bcrypt = require('bcryptjs');

module.exports = {
  up: QueryInterface => {
    const adminPassword = process.env.ADMIN_SEED_PASSWORD;

    if (!adminPassword) {
      throw new Error(
        'ADMIN_SEED_PASSWORD is required to seed the admin user.'
      );
    }

    return QueryInterface.bulkInsert(
      'users',
      [
        {
          email: 'admin@gobrewery.com',
          password_hash: bcrypt.hashSync(adminPassword, 8),
          name: 'Administrator',
          administrator: true,
          guest: false,
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
