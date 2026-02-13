import * as Yup from 'yup';
import User from '../models/User';

class ProfileController {
  async index(req, res) {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'email', 'administrator', 'guest'],
    });

    return res.json(user);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (
      !(await schema.isValid(req.body, { strict: true, stripUnknown: true }))
    ) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const allowedFields = [
      'name',
      'email',
      'oldPassword',
      'password',
      'confirmPassword',
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

    const { email, oldPassword } = payload;

    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res
          .status(400)
          .json({ error: 'Another user with this e-mail already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Password does not match.' });
    }

    const { id, name, email: updatedEmail } = await user.update(payload);

    return res.json({
      id,
      name,
      email: updatedEmail,
    });
  }
}

export default new ProfileController();
