import * as Yup from 'yup';
import { parseISO, isBefore, isAfter } from 'date-fns';
import Product from '../models/Product';
import ProductPrice from '../models/ProductPrice';

class ProductPriceController {
  async index(req, res) {
    const attributes = [
      'id',
      'description',
      'starting_date',
      'expiration_date',
      'price',
    ];

    const include = {
      model: Product,
      as: 'product',
      attributes: ['id', 'name'],
    };

    if (req.params.id) {
      const prices = await ProductPrice.findByPk(req.params.id, {
        attributes,
        include,
      });
      return res.json(prices);
    }

    const prices = await ProductPrice.findAll({
      where: { product_id: req.params.productId },
      attributes,
      order: [
        ['starting_date', 'DESC'],
        ['expiration_date', 'DESC'],
      ],
      include,
    });
    return res.json(prices);
  }

  async store(req, res) {
    const product = await Product.findByPk(req.params.productId, {
      attributes: ['id', 'name'],
    });

    if (!product) {
      return res.status(404).json({ error: 'This product was not found.' });
    }

    const schema = Yup.object().shape({
      description: Yup.string(),
      starting_date: Yup.date().required(),
      expiration_date: Yup.date().required(),
      price: Yup.number()
        .required()
        .moreThan(0),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    if (
      isBefore(
        parseISO(req.body.expiration_date),
        parseISO(req.body.starting_date)
      )
    ) {
      return res
        .status(400)
        .json({ error: `Expiration date can't be before starting date.` });
    }

    if (
      isAfter(
        parseISO(req.body.starting_date),
        parseISO(req.body.expiration_date)
      )
    ) {
      return res
        .status(400)
        .json({ error: `Starting date can't be after expiration date.` });
    }

    const {
      id,
      product_id,
      description,
      starting_date,
      expiration_date,
      price,
    } = await ProductPrice.create({ product_id: product.id, ...req.body });

    return res.json({
      id,
      product_id,
      description,
      starting_date,
      expiration_date,
      price,
    });
  }

  async update(req, res) {
    const productPrice = await ProductPrice.findByPk(req.params.id);

    if (!productPrice) {
      return res.status(404).json({ error: 'This price was not found.' });
    }

    const schema = Yup.object().shape({
      description: Yup.string(),
      starting_date: Yup.date().required(),
      expiration_date: Yup.date().required(),
      price: Yup.number()
        .required()
        .moreThan(0),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    if (isBefore(req.body.expiration_date, req.body.starting_date)) {
      return res
        .status(400)
        .json({ error: `Expiration date can't be before starting date.` });
    }

    if (isAfter(req.body.starting_date, req.body.expiration_date)) {
      return res
        .status(400)
        .json({ error: `Starting date can't be after expiration date.` });
    }

    const {
      id,
      product_id,
      description,
      starting_date,
      expiration_date,
      price,
    } = await productPrice.update(req.body);

    return res.json({
      id,
      product_id,
      description,
      starting_date,
      expiration_date,
      price,
    });
  }
}

export default new ProductPriceController();
