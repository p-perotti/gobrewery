import * as Yup from 'yup';
import Coupon from '../models/Coupon';

class CouponController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const coupons = await Coupon.findAll({
      order: ['name'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: [
        'id',
        'name',
        'description',
        'starting_date',
        'expiration_date',
        'type',
        'value',
      ],
    });
    return res.json(coupons);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string(),
      starting_date: Yup.date().required(),
      expiration_date: Yup.date().required(),
      type: Yup.string().required(),
      value: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const {
      id,
      name,
      description,
      starting_date,
      expiration_date,
      type,
      value,
    } = await Coupon.create(req.body);

    return res.json({
      id,
      name,
      description,
      starting_date,
      expiration_date,
      type,
      value,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      description: Yup.string(),
      starting_date: Yup.date(),
      expiration_date: Yup.date(),
      type: Yup.string(),
      value: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const coupon = await Coupon.findByPk(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        error: 'Coupon with this given ID was not found.',
      });
    }

    const {
      id,
      name,
      description,
      starting_date,
      expiration_date,
      type,
      value,
    } = await coupon.update(req.body);

    return res.json({
      id,
      name,
      description,
      starting_date,
      expiration_date,
      type,
      value,
    });
  }
}

export default new CouponController();
