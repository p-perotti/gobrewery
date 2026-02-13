import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async index(req, res) {
    const attributes = ['id', 'name', 'email', 'administrator', 'guest', 'active'];

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
      guest: Yup.boolean(),
      active: Yup.boolean().required(),
    });

    if (!(await schema.isValid(req.body, { strict: true, stripUnknown: true }))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const allowedFields = [
      'email',
      'password',
      'name',
      'administrator',
      'guest',
      'active',
    ];
    const unknownFields = Object.keys(req.body).filter(
      key => !allowedFields.includes(key)
    );

    if (unknownFields.length > 0) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const payload = allowedFields.reduce((acc, key) => {
      if (req.body[key] !== undefined) {
        acc[key] = req.body[key];
      }
      return acc;
    }, {});

    if (payload.administrator && payload.guest) {
      return res.status(400).json({
        error: 'A user cannot be administrator and guest at the same time.',
      });
    }

    const userExists = await User.findOne({ where: { email: payload.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, email, name, administrator, guest, active } = await User.create(payload);

    return res.json({
      id,
      email,
      name,
      administrator,
      guest,
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
      administrator: Yup.boolean(),
      guest: Yup.boolean(),
      active: Yup.boolean(),
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

    if (!(await schema.isValid(req.body, { strict: true, stripUnknown: true }))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const allowedFields = [
      'name',
      'email',
      'administrator',
      'guest',
      'active',
      'oldPassword',
      'password',
      'passwordConfirmation',
    ];
    const unknownFields = Object.keys(req.body).filter(
      key => !allowedFields.includes(key)
    );

    if (unknownFields.length > 0) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const payload = allowedFields.reduce((acc, key) => {
      if (req.body[key] !== undefined) {
        acc[key] = req.body[key];
      }
      return acc;
    }, {});

    if (payload.administrator && payload.guest) {
      return res.status(400).json({
        error: 'A user cannot be administrator and guest at the same time.',
      });
    }

    const { email, oldPassword } = payload;

    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'E-mail already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Password does not match.' });
    }

    const { id, name, administrator, guest, active } = await user.update(payload);

    return res.json({
      id,
      email,
      name,
      administrator,
      guest,
      active,
    });
  }
}

export default new UserController();
