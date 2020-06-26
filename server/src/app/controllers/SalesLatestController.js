import { Op } from 'sequelize';

import Sale from '../models/Sale';
import Customer from '../models/Customer';
import PaymentMethod from '../models/PaymentMethod';

class SalesLatestController {
  async index(req, res) {
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
      attributes: ['date', 'status', 'total_amount', 'net_total'],
      where: {
        status: {
          [Op.not]: 'C',
        },
      },
      order: [['date', 'DESC']],
      limit: 5,
    });

    return res.json(totals);
  }
}

export default new SalesLatestController();
