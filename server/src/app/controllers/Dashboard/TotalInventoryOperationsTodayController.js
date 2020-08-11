import { Op } from 'sequelize';
import { startOfDay } from 'date-fns';

import InventoryOperation from '../../models/InventoryOperation';

import Database from '../../../database';

class InventoryOperationsTodaysTotalController {
  async index(req, res) {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({
        error: 'Must specify the type of inventory operation.',
      });
    }

    if (type !== 'E' && type !== 'S') {
      return res
        .status(400)
        .json({ error: 'Type of inventory operation must be one of (E, S).' });
    }

    const total = await InventoryOperation.findOne({
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

export default new InventoryOperationsTodaysTotalController();
