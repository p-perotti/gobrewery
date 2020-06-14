import * as Yup from 'yup';
import Product from '../models/Product';

class ProductController {
  async index(req, res) {
    const attributes = ['id', 'name', 'barcode', 'description', 'active'];

    if (req.params.id) {
      const product = await Product.findByPk(req.params.id, { attributes });
      return res.json(product);
    }

    const products = await Product.findAll({ attributes, order: ['name'] });
    return res.json(products);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      barcode: Yup.string(),
      description: Yup.string(),
      active: Yup.boolean().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { id, name, barcode, description, active } = await Product.create(
      req.body
    );

    return res.json({
      id,
      name,
      barcode,
      description,
      active,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      barcode: Yup.string(),
      description: Yup.string(),
      active: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: 'Product with this given ID was not found.',
      });
    }

    const { id, name, barcode, description, active } = await product.update(
      req.body
    );

    return res.json({
      id,
      name,
      barcode,
      description,
      active,
    });
  }
}

export default new ProductController();
