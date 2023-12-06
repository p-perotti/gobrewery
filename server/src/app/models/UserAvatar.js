import Sequelize, { Model } from 'sequelize';

class UserAvatar extends Model {
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
        tableName: 'users_avatars',
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'users',
    });
  }
}

export default UserAvatar;
