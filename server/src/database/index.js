import Sequelize from 'sequelize';

import User from '../app/models/User';
import UserAvatar from '../app/models/UserAvatar';
import Size from '../app/models/Size';
import Product from '../app/models/Product';
import ProductPrice from '../app/models/ProductPrice';
import ProductImage from '../app/models/ProductImage';
import Coupon from '../app/models/Coupon';
import StockOperation from '../app/models/StockOperation';
import StockOperationProduct from '../app/models/StockOperationProduct';
import ProductStockAmount from '../app/models/ProductStockAmount';
import PaymentMethod from '../app/models/PaymentMethod';
import Customer from '../app/models/Customer';
import Sale from '../app/models/Sale';
import SaleProduct from '../app/models/SaleProduct';

import databaseConfig from '../config/database';

const models = [
  User,
  UserAvatar,
  Size,
  Product,
  ProductPrice,
  ProductImage,
  Coupon,
  StockOperation,
  StockOperationProduct,
  ProductStockAmount,
  PaymentMethod,
  Customer,
  Sale,
  SaleProduct,
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
