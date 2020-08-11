import { Op, literal } from 'sequelize';
import { parseISO, startOfDay, endOfDay, isBefore, isAfter } from 'date-fns';

import Sale from '../../models/Sale';
import SaleProduct from '../../models/SaleProduct';
import Product from '../../models/Product';
import Size from '../../models/Size';

import Database from '../../../database';

class BestSellersByLiterController {
  async index(req, res) {
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

    const products = await SaleProduct.findAll({
      include: [
        {
          model: Sale,
          as: 'sale',
          attributes: [],
          where: {
            date: {
              [Op.between]: [startingDate, endingDate],
            },
            status: {
              [Op.not]: 'C',
            },
          },
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name'],
        },
        {
          model: Size,
          as: 'size',
          attributes: [],
        },
      ],
      attributes: [
        [
          Database.connection.fn('sum', literal('amount * size.capacity')),
          'liters',
        ],
      ],
      group: ['product.id'],
      order: [
        [
          Database.connection.fn('sum', literal('amount * size.capacity')),
          'DESC',
        ],
      ],
      limit: 5,
    });

    return res.json(products);
  }
}

export default new BestSellersByLiterController();
