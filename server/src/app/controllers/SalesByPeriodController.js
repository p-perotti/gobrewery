import { Op } from 'sequelize';
import { parseISO, startOfDay, endOfDay, isBefore, isAfter } from 'date-fns';

import Sale from '../models/Sale';
import Customer from '../models/Customer';
import PaymentMethod from '../models/PaymentMethod';

class SalesByPeriodController {
  async index(req, res) {
    const startingDate = startOfDay(parseISO(req.query.startingDate));
    const endingDate = endOfDay(parseISO(req.query.endingDate));

    if (isAfter(startingDate, endingDate)) {
      return res
        .status(400)
        .json({ error: `Starting date must be before ending date.` });
    }

    if (isBefore(endingDate, startingDate)) {
      return res
        .status(400)
        .json({ error: `Ending date must be after starting date.` });
    }

    const totals = await Sale.findAll({
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name'],
        },
        {
          model: PaymentMethod,
          as: 'payment_method',
          attributes: ['id', 'name'],
        },
      ],
      attributes: [
        'date',
        'status',
        'total_amount',
        'gross_total',
        'net_total',
        'total_discount',
      ],
      where: {
        status: {
          [Op.not]: 'C',
        },
        date: {
          [Op.between]: [startingDate, endingDate],
        },
      },
      order: ['date'],
    });

    return res.json(totals);
  }
}

export default new SalesByPeriodController();
