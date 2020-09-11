import { Op, literal } from 'sequelize';
import { parseISO, startOfDay, endOfDay, isBefore, isAfter } from 'date-fns';

import ProductStockAmount from '../../models/ProductStockAmount';
import StockOperation from '../../models/StockOperation';
import StockOperationProduct from '../../models/StockOperationProduct';
import Product from '../../models/Product';
import Size from '../../models/Size';

import Database from '../../../database';

class StockOperationsController {
  async index(req, res) {
    if (req.query.synthetic && req.query.synthetic === 'true') {
      const products = await ProductStockAmount.findAll({
        include: [
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
        attributes: [['amount', 'current_balance']],
        order: [
          ['product', 'name'],
          ['size', 'description'],
        ],
      });

      return res.json(products);
    }

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

    const data = await StockOperationProduct.findAll({
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
          required: true,
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
          Database.connection.fn(
            'sum',
            literal(`CASE type WHEN 'E' THEN amount ELSE 0 END`)
          ),
          'inward',
        ],
        [
          Database.connection.fn(
            'sum',
            literal(`CASE type WHEN 'S' THEN amount ELSE 0 END`)
          ),
          'outward',
        ],
      ],
      group: ['product.id', 'size.id'],
      order: [
        ['product', 'name'],
        ['size', 'description'],
      ],
    });

    const products = await Promise.all(
      data.map(async row => {
        const { product, size, inward, outward } = row.get();

        const balance = await StockOperationProduct.findOne({
          include: [
            {
              model: StockOperation,
              as: 'stock_operation',
              attributes: [],
              where: {
                date: {
                  [Op.lt]: startingDate,
                },
                canceled: false,
              },
              required: true,
            },
          ],
          attributes: [
            [
              Database.connection.fn(
                'sum',
                literal(`CASE type WHEN 'E' THEN amount ELSE (amount * -1) END`)
              ),
              'previous',
            ],
          ],
          where: {
            product_id: product.id,
            size_id: size.id,
          },
          group: ['product_id', 'size_id'],
          raw: true,
        });

        if (balance) {
          return {
            product,
            size,
            previous_balance: Number(balance.previous),
            in: Number(inward),
            out: Number(outward),
            current_balance:
              Number(balance.previous) + (Number(inward) - Number(outward)),
          };
        }

        return {
          product,
          size,
          previous_balance: 0,
          inward: Number(inward),
          outward: Number(outward),
          current_balance: Number(inward) - Number(outward),
        };
      })
    );

    return res.json(products);
  }
}

export default new StockOperationsController();
