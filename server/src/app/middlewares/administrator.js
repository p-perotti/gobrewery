import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  try {
    const [, token] = req.headers.authorization.split(' ');

    const { administrator } = await promisify(jwt.verify)(
      token,
      authConfig.secret
    );

    if (!administrator) {
      return res.status(401).json({
        error: 'Administrator rights are required to perform this action.',
      });
    }

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};
