import { Op } from 'sequelize';
import { parseISO, startOfDay, endOfDay, isBefore, isAfter } from 'date-fns';

import Sale from '../../models/Sale';
import Coupon from '../../models/Coupon';

import Database from '../../../database';

class TotalDiscountByCouponController {
  async index(req, res) {
    if (!req.query.startingDate || !req.query.endingDate) {
      return res.status(400).json({
        error: 'Starting and ending date request params must have value.',
      });
    }

    const startingDate = startOfDay(parseISO(req.query.startingDate));
    const endingDate = endOfDay(parseISO(req.query.endingDate));

    if (isAfter(startingDate, endingDate)) {
      return res
        .status(400)
        .json({ error: 'Starting date must be before ending date.' });
    }

    if (isBefore(endingDate, startingDate)) {
      return res
        .status(400)
        .json({ error: 'Ending date must be after starting date.' });
    }

    const coupons = await Sale.findAll({
      include: [
        {
          model: Coupon,
          as: 'coupon',
          attributes: ['id', 'name', 'type', 'value'],
          required: true,
        },
      ],
      attributes: [
        [Database.connection.fn('count', '*'), 'used'],
        [
          Database.connection.fn(
            'sum',
            Database.connection.col('total_discount')
          ),
          'total_discount',
        ],
      ],
      where: {
        date: {
          [Op.between]: [startingDate, endingDate],
        },
        status: {
          [Op.not]: 'C',
        },
      },
      group: ['coupon.id'],
    });

    return res.json(coupons);
  }
}

export default new TotalDiscountByCouponController();
