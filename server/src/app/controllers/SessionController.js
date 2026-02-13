import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import User from '../models/User';
import UserAvatar from '../models/UserAvatar';

function formatSessionResponse(user, forceGuest) {
  const { id, name, email, avatar, administrator, guest } = user;
  const isGuest = forceGuest === undefined ? !!guest : forceGuest;

  return {
    user: {
      id,
      name,
      email,
      avatar,
      administrator,
      guest: isGuest,
    },
    token: jwt.sign({ id, administrator, guest: isGuest }, authConfig.secret),
  };
}

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: {
        model: UserAvatar,
        as: 'avatar',
        attributes: ['id', 'url', 'path'],
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    if (!user.active) {
      return res.status(401).json({ error: 'Inactive user.' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match.' });
    }

    return res.json(formatSessionResponse(user));
  }

  async guest(req, res) {
    const user = await User.findOne({
      where: { email: 'guest@gobrewery.com', guest: true },
      include: {
        model: UserAvatar,
        as: 'avatar',
        attributes: ['id', 'url', 'path'],
      },
    });

    if (!user || !user.active) {
      return res.status(401).json({ error: 'Guest user unavailable.' });
    }

    return res.json(formatSessionResponse(user, true));
  }
}

export default new SessionController();
