import Sequelize from 'sequelize';

import User from '../app/models/User';
import Package from '../app/models/Package';
import Product from '../app/models/Product';

import databaseConfig from '../config/database';

const models = [User, Package, Product];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
