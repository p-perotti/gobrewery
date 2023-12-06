import { unlinkSync } from 'fs';
import { resolve } from 'path';
import UserAvatar from '../models/UserAvatar';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import bucket from '../../config/bucket';

const s3 = new S3Client(bucket);

class ProfileAvatarController {
  async store(req, res) {
    if (!req.file) {
      return res.status(404).json({ error: 'Must upload a file.' });
    }

    const { originalname, filename, key } = req.file;

    try {
      const currentAvatar = await UserAvatar.findOne({
        where: {
          user_id: req.userId,
        },
      });

      if (currentAvatar) {
        if (process.env.IMAGE_STORAGE_TYPE === 'local') {
          unlinkSync(
            resolve(
              __dirname,
              '..',
              '..',
              '..',
              'tmp',
              'uploads',
              currentAvatar.path
            )
          );
        } else {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.BUCKET_NAME,
              Key: currentAvatar.path,
            })
          );
        }

        await currentAvatar.destroy();
      }

      const { id, user_id, url, name, path } = await UserAvatar.create({
        user_id: req.userId,
        name: originalname,
        path: process.env.IMAGE_STORAGE_TYPE === 'local' ? filename : key,
      });

      return res.json({ id, user_id, url, name, path });
    } catch (error) {
      if (process.env.IMAGE_STORAGE_TYPE === 'local') {
        unlinkSync(
          resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', filename)
        );
      }

      throw error;
    }
  }

  async delete(req, res) {
    const avatar = await UserAvatar.findOne({
      where: {
        user_id: req.userId,
      },
    });

    if (avatar) {
      if (process.env.IMAGE_STORAGE_TYPE === 'local') {
        unlinkSync(
          resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', avatar.path)
        );
      } else {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: avatar.path,
          })
        );
      }

      await avatar.destroy();
    } else {
      return res.status(404).json({
        error: 'Profile avatar with this given user ID was not found.',
      });
    }

    return res.json();
  }
}

export default new ProfileAvatarController();
