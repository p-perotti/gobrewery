import Sequelize from 'sequelize';

import User from '../app/models/User';
import Size from '../app/models/Size';
import Product from '../app/models/Product';
import ProductPrice from '../app/models/ProductPrice';
import Coupon from '../app/models/Coupon';
import InventoryOperation from '../app/models/InventoryOperation';
import InventoryOperationProduct from '../app/models/InventoryOperationProduct';
import ProductInventoryQuantity from '../app/models/ProductInventoryQuantity';

import databaseConfig from '../config/database';

const models = [
  User,
  Size,
  Product,
  ProductPrice,
  Coupon,
  InventoryOperation,
  InventoryOperationProduct,
  ProductInventoryQuantity,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
