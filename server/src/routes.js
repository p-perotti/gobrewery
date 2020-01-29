import { Router } from 'express';

import User from './app/models/User';

const routes = Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    email: 'patrickperotti0@gmail.com',
    password_hash: '666',
    name: 'Patrick Perotti',
    type: 'F',
    birthdate: '1996-04-01',
  });

  return res.json(user);
});

export default routes;
