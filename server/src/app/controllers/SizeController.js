import * as Yup from 'yup';
import Size from '../models/Size';

class SizeController {
  async index(req, res) {
    if (req.params.id) {
      const productSize = await Size.findByPk(req.params.id, {
        attributes: ['active', 'description'],
      });
      return res.json(productSize);
    }

    const { active } = req.query;

    const where = active ? { active } : {};

    const attributes = active
      ? ['id', 'description']
      : ['id', 'description', 'capacity', 'active'];

    const order = active
      ? ['description']
      : [['active', 'DESC'], 'description'];

    const sizes = await Size.findAll({
      attributes,
      where,
      order,
    });

    return res.json(sizes);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
      capacity: Yup.number().moreThan(0),
      active: Yup.boolean().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { id, description, capacity, active } = await Size.create(req.body);

    return res.json({
      id,
      description,
      capacity,
      active,
    });
  }

  async update(req, res) {
    const productSize = await Size.findByPk(req.params.id);

    if (!productSize) {
      return res.status(404).json({
        error: 'Size with this given ID was not found.',
      });
    }

    const schema = Yup.object().shape({
      description: Yup.string().required(),
      capacity: Yup.number().moreThan(0),
      active: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { id, description, capacity, active } = await productSize.update(
      req.body
    );

    return res.json({
      id,
      description,
      capacity,
      active,
    });
  }
}

export default new SizeController();
