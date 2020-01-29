module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  port: '5432',
  username: 'postgres',
  password: 'postgres',
  database: 'gobrewery',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
