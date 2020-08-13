import { Op } from 'sequelize';
import { startOfDay } from 'date-fns';

import StockOperation from '../../models/StockOperation';

import Database from '../../../database';

class TotalStockOperationsTodayController {
  async index(req, res) {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({
        error: 'Must specify the type of stock operation.',
      });
    }

    if (type !== 'E' && type !== 'S') {
      return res
        .status(400)
        .json({ error: 'Type of stock operation must be one of (E, S).' });
    }

    const total = await StockOperation.findOne({
      attributes: [
        [
          Database.connection.fn(
            'sum',
            Database.connection.col('total_amount')
          ),
          'total',
        ],
      ],
      where: {
        date: {
          [Op.gte]: startOfDay(new Date()),
        },
        type,
        canceled: false,
      },
    });

    return res.json(total);
  }
}

export default new TotalStockOperationsTodayController();
