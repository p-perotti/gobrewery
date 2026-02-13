import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';
import User from '../models/User';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const { id } = await promisify(jwt.verify)(token, authConfig.secret);
    const user = await User.findByPk(id, {
      attributes: ['id', 'administrator', 'guest', 'active'],
    });

    if (!user || !user.active) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.userId = id;
    req.isAdministrator = !!user.administrator;
    req.isGuest = !!user.guest;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};
