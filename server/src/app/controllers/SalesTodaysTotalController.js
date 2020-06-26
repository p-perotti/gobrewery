import { Op } from 'sequelize';
import { startOfDay } from 'date-fns';

import Sale from '../models/Sale';

import Database from '../../database';

class SalesTodaysTotalController {
  async index(req, res) {
    const total = await Sale.findOne({
      attributes: [
        [
          Database.connection.fn('sum', Database.connection.col('net_total')),
          'total',
        ],
      ],
      where: {
        date: {
          [Op.gte]: startOfDay(new Date()),
        },
        status: {
          [Op.not]: 'C',
        },
      },
    });

    return res.json(total);
  }
}

export default new SalesTodaysTotalController();
