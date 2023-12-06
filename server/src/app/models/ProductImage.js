import Sequelize, { Model } from 'sequelize';

class ProductImage extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return process.env.IMAGE_STORAGE_TYPE === 'local'
              ? `${process.env.APP_URL}/files/${this.path}`
              : `${process.env.BUCKET_URL}/${this.path}`;
          },
        },
      },
      {
        tableName: 'products_images',
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product',
    });
  }
}

export default ProductImage;
