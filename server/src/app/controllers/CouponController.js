import * as Yup from 'yup';
import { parseISO, isBefore, isAfter } from 'date-fns';
import Coupon from '../models/Coupon';

class CouponController {
  async index(req, res) {
    const attributes = [
      'id',
      'name',
      'description',
      'starting_date',
      'expiration_date',
      'type',
      'value',
    ];

    if (req.params.id) {
      const coupon = await Coupon.findByPk(req.params.id, { attributes });
      return res.json(coupon);
    }

    const coupons = await Coupon.findAll({
      attributes,
      order: [
        ['starting_date', 'DESC'],
        ['expiration_date', 'DESC'],
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
      type: Yup.string()
        .required()
        .oneOf(['P', 'V']),
      value: Yup.number()
        .required()
        .moreThan(0)
        .when('type', (type, field) =>
          type === 'P' ? field.lessThan(100) : field
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    if (
      isAfter(
        parseISO(req.body.starting_date),
        parseISO(req.body.expiration_date)
      )
    ) {
      return res
        .status(400)
        .json({ error: `Starting date must be before expiration date.` });
    }

    if (
      isBefore(
        parseISO(req.body.expiration_date),
        parseISO(req.body.starting_date)
      )
    ) {
      return res
        .status(400)
        .json({ error: `Expiration date must be after starting date.` });
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
    const coupon = await Coupon.findByPk(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        error: 'Coupon with this given ID was not found.',
      });
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string(),
      starting_date: Yup.date().required(),
      expiration_date: Yup.date().required(),
      type: Yup.string()
        .required()
        .oneOf(['P', 'V']),
      value: Yup.number()
        .required()
        .moreThan(0)
        .when('type', (type, field) =>
          type === 'P' ? field.lessThan(100) : field
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    if (
      isAfter(
        parseISO(req.body.starting_date),
        parseISO(req.body.expiration_date)
      )
    ) {
      return res
        .status(400)
        .json({ error: `Starting date must be before expiration date.` });
    }

    if (
      isBefore(
        parseISO(req.body.expiration_date),
        parseISO(req.body.starting_date)
      )
    ) {
      return res
        .status(400)
        .json({ error: `Expiration date must be after starting date.` });
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
