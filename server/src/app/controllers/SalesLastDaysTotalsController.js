import { Op } from 'sequelize';
import { subDays, startOfDay } from 'date-fns';

import Sale from '../models/Sale';

import Database from '../../database';

class SalesLastDaysTotalsController {
  async index(req, res) {
    const totals = await Sale.findAll({
      attributes: [
        [
          Database.connection.fn('date', Database.connection.col('date')),
          'date',
        ],
        [
          Database.connection.fn('sum', Database.connection.col('net_total')),
          'total',
        ],
      ],
      where: {
        date: {
          [Op.gte]: startOfDay(subDays(new Date(), 7)),
        },
        status: {
          [Op.not]: 'C',
        },
      },
      group: [
        [
          Database.connection.fn('date', Database.connection.col('date')),
          'date',
        ],
      ],
      order: [
        [[Database.connection.fn('date', Database.connection.col('date'))]],
      ],
    });

    return res.json(totals);
  }
}

export default new SalesLastDaysTotalsController();
