import { Op, literal } from 'sequelize';
import { parseISO, startOfMonth, endOfMonth } from 'date-fns';

import StockOperation from '../../models/StockOperation';
import StockOperationProduct from '../../models/StockOperationProduct';

import Database from '../../../database';

class MonthlyStockOperationsByWeek {
  async index(req, res) {
    if (!req.query.monthYear) {
      return res.status(400).json({
        error: 'Month request param must have value.',
      });
    }

    const startingDate = startOfMonth(parseISO(req.query.monthYear));
    const endingDate = endOfMonth(parseISO(req.query.monthYear));

    const products = await StockOperationProduct.findAll({
      include: [
        {
          model: StockOperation,
          as: 'stock_operation',
          attributes: [],
          where: {
            date: {
              [Op.between]: [startingDate, endingDate],
            },
            canceled: false,
          },
        },
      ],
      attributes: [
        [Database.connection.fn('extract', literal('week from date')), 'week'],
        [
          Database.connection.fn(
            'sum',
            literal(`CASE type WHEN 'E' THEN amount ELSE 0 END`)
          ),
          'inwards',
        ],
        [
          Database.connection.fn(
            'sum',
            literal(`CASE type WHEN 'S' THEN amount ELSE 0 END`)
          ),
          'outwards',
        ],
      ],
      group: [Database.connection.fn('extract', literal('week from date'))],
    });

    return res.json(products);
  }
}

export default new MonthlyStockOperationsByWeek();
