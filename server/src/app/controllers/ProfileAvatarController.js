import { unlinkSync } from 'fs';
import { resolve } from 'path';
import UserAvatar from '../models/UserAvatar';

class ProfileAvatarController {
  async store(req, res) {
    if (!req.file) {
      return res.status(404).json({ error: 'Must upload a file.' });
    }

    const { originalname, filename } = req.file;

    try {
      const currentAvatar = await UserAvatar.findOne({
        where: {
          user_id: req.userId,
        },
      });

      if (currentAvatar) {
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
        await currentAvatar.destroy();
      }

      const { id, user_id, url, name, path } = await UserAvatar.create({
        user_id: req.userId,
        name: originalname,
        path: filename,
      });

      return res.json({ id, user_id, url, name, path });
    } catch (error) {
      unlinkSync(
        resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', filename)
      );

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
      unlinkSync(
        resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', avatar.path)
      );
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
