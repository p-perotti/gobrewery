import { Op } from 'sequelize';
import { parseISO, startOfDay, endOfDay, isBefore, isAfter } from 'date-fns';

import Sale from '../../models/Sale';
import SaleProduct from '../../models/SaleProduct';
import Customer from '../../models/Customer';
import PaymentMethod from '../../models/PaymentMethod';
import Product from '../../models/Product';
import Size from '../../models/Size';

import Database from '../../../database';

class SalesController {
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

    switch (req.query.groupBy) {
      case 'sale': {
        const sales = await Sale.findAll({
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

        return res.json(sales);
      }
      case 'product': {
        const products = await SaleProduct.findAll({
          include: [
            {
              model: Sale,
              as: 'sale',
              attributes: [],
              where: {
                status: {
                  [Op.not]: 'C',
                },
                date: {
                  [Op.between]: [startingDate, endingDate],
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
              attributes: ['id', 'description'],
            },
          ],
          attributes: [
            [
              Database.connection.fn('sum', Database.connection.col('amount')),
              'amount',
            ],
            'unit_price',
            [
              Database.connection.fn('sum', Database.connection.col('price')),
              'total',
            ],
          ],
          group: ['product.id', 'size.id', 'unit_price'],
          order: [
            ['product', 'name'],
            ['size', 'description'],
          ],
        });

        return res.json(products);
      }
      default:
        return res
          .status(400)
          .json({ error: 'Group by request param must have value.' });
    }
  }
}

export default new SalesController();
