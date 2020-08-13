import { Op, literal } from 'sequelize';
import { parseISO, startOfDay, endOfDay, isBefore, isAfter } from 'date-fns';

import InventoryOperation from '../../models/InventoryOperation';
import InventoryOperationProduct from '../../models/InventoryOperationProduct';
import Product from '../../models/Product';
import Size from '../../models/Size';

import Database from '../../../database';

class InventoryOperationsController {
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

    const data = await InventoryOperationProduct.findAll({
      include: [
        {
          model: InventoryOperation,
          as: 'inventory_operation',
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

        const { previous } = await InventoryOperationProduct.findAll({
          include: [
            {
              model: InventoryOperation,
              as: 'inventory_operation',
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
        });

        if (!previous) {
          return {
            product,
            size,
            previous: 0,
            in: Number(inward),
            out: Number(outward),
            current: Number(inward) - Number(outward),
          };
        }

        return {
          product,
          size,
          previous: Number(previous),
          in: Number(inward),
          out: Number(outward),
          current: Number(previous) + Number(inward) - Number(outward),
        };
      })
    );

    return res.json(products);
  }
}

export default new InventoryOperationsController();
