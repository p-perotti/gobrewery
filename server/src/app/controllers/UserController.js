import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async index(req, res) {
    const attributes = ['id', 'name', 'email', 'administrator', 'active'];

    if (req.params.id) {
      const user = await User.findByPk(req.params.id, { attributes });
      return res.json(user);
    }

    const users = await User.findAll({
      attributes,
      order: [['active', 'DESC'], 'name'],
    });

    return res.json(users);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(8),
      name: Yup.string().required(),
      administrator: Yup.boolean().required(),
      active: Yup.boolean().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, email, name, administrator, active } = await User.create(
      req.body
    );

    return res.json({
      id,
      email,
      name,
      administrator,
      active,
    });
  }

  async update(req, res) {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'User with this given ID was not found.',
      });
    }

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(8),
      password: Yup.string()
        .min(8)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      passwordConfirmation: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { email, oldPassword } = req.body;

    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'E-mail already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Password does not match.' });
    }

    const { id, name, administrator, active } = await user.update(req.body);

    return res.json({
      id,
      email,
      name,
      administrator,
      active,
    });
  }
}

export default new UserController();
