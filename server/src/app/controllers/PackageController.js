import * as Yup from 'yup';
import Package from '../models/Package';

class PackageController {
  async index(req, res) {
    const attributes = ['id', 'description', 'active'];

    if (req.params.id) {
      const productPackage = await Package.findByPk(req.params.id, {
        attributes,
      });
      return res.json(productPackage);
    }

    const packages = await Package.findAll({ attributes });
    return res.json(packages);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
      active: Yup.boolean().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { id, description, active } = await Package.create(req.body);

    return res.json({
      id,
      description,
      active,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string(),
      active: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const productPackage = await Package.findByPk(req.params.id);

    if (!productPackage) {
      return res.status(404).json({
        error: 'Package with this given ID was not found.',
      });
    }

    const { id, description, active } = await productPackage.update(req.body);

    return res.json({
      id,
      description,
      active,
    });
  }
}

export default new PackageController();
