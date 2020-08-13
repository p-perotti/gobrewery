import * as Yup from 'yup';
import StockOperation from '../models/StockOperation';
import StockOperationProduct from '../models/StockOperationProduct';
import ProductStockAmount from '../models/ProductStockAmount';
import User from '../models/User';

import Database from '../../database';

class StockOperationController {
  async index(req, res) {
    const attributes = ['id', 'type', 'total_amount', 'date', 'canceled'];

    const include = [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name'],
      },
      {
        model: User,
        as: 'cancelation_user',
        attributes: ['id', 'name'],
      },
    ];

    if (req.params.id) {
      const stockOperation = await StockOperation.findByPk(req.params.id, {
        attributes,
        include,
      });

      return res.json(stockOperation);
    }

    const stockOperations = await StockOperation.findAll({
      attributes,
      order: [['date', 'DESC']],
      include,
    });

    return res.json(stockOperations);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      type: Yup.string()
        .required()
        .oneOf(['E', 'S']),
      date: Yup.date().required(),
      total_amount: Yup.number()
        .required()
        .moreThan(0),
      stock_operation_products: Yup.array()
        .of(
          Yup.object().shape({
            product_id: Yup.number().required(),
            size_id: Yup.number(),
            amount: Yup.number()
              .required()
              .moreThan(0),
          })
        )
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const transaction = await Database.connection.transaction();

    try {
      const {
        id,
        user_id,
        type,
        date,
        total_amount,
      } = await StockOperation.create(
        {
          user_id: req.userId,
          type: req.body.type,
          date: req.body.date,
          total_amount: req.body.total_amount,
        },
        { transaction }
      );

      let totalAmount = 0;

      const reqProduct = req.body.stock_operation_products.map(p => {
        totalAmount += Number(p.amount);

        return {
          stock_operation_id: id,
          ...p,
        };
      });

      const resProduct = await StockOperationProduct.bulkCreate(
        reqProduct,
        { transaction }
      );

      if (totalAmount !== total_amount) {
        return res.status(404).json({
          error: 'Total amount different from the sum of the product amounts.',
        });
      }

      const updateProductStockAmount = async (
        product_id,
        size_id,
        amount
      ) => {
        const fields = [
          'product_id',
          'size_id',
          'amount',
          'created_at',
          'updated_at',
        ];

        const productStockAmount = await ProductStockAmount.findOne({
          where: { product_id, size_id },
          attributes: ['product_id', 'size_id', 'amount'],
        });

        if (productStockAmount) {
          let newAmount;

          if (type === 'E') {
            newAmount = Number(productStockAmount.amount) + Number(amount);
          } else if (type === 'S') {
            newAmount = Number(productStockAmount.amount) - Number(amount);
          }

          await ProductStockAmount.update(
            {
              product_id,
              size_id,
              amount: newAmount,
            },
            { fields, where: { product_id, size_id }, transaction }
          );
        } else {
          await ProductStockAmount.create(
            {
              product_id,
              size_id,
              amount,
            },
            {
              fields,
              transaction,
            }
          );
        }
      };

      const stock_operation_products = await Promise.all(
        resProduct.map(async p => {
          await updateProductStockAmount(p.product_id, p.size_id, p.amount);

          return {
            id: p.id,
            stock_operation_id: p.stock_operation_id,
            product_id: p.product_id,
            size_id: p.size_id,
            amount: p.amount,
          };
        })
      );

      await transaction.commit();

      return res.json({
        id,
        user_id,
        type,
        date,
        total_amount,
        stock_operation_products,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async delete(req, res) {
    const stockOperation = await StockOperation.findByPk(req.params.id);

    if (!stockOperation) {
      return res.status(404).json({
        error: 'Stock operation with this given ID was not found.',
      });
    }

    if (stockOperation.canceled) {
      return res.status(404).json({
        error: 'Stock operation already canceled.',
      });
    }

    const transaction = await Database.connection.transaction();

    try {
      const {
        id,
        type,
        canceled,
        canceled_at,
        cancelation_user_id,
      } = await stockOperation.update(
        {
          canceled: true,
          canceled_at: new Date(),
          cancelation_user_id: req.userId,
        },
        { transaction }
      );

      const stockOperationsProducts = await StockOperationProduct.findAll({
        where: { stock_operation_id: id },
        attributes: ['product_id', 'size_id', 'amount'],
        transaction,
      });

      const updateProductStockAmount = async (
        product_id,
        size_id,
        amount
      ) => {
        const fields = [
          'product_id',
          'size_id',
          'amount',
          'created_at',
          'updated_at',
        ];

        const productStockAmount = await ProductStockAmount.findOne({
          where: { product_id, size_id },
          attributes: ['product_id', 'size_id', 'amount'],
        });

        let newAmount;

        if (type === 'S') {
          newAmount = Number(productStockAmount.amount) + Number(amount);
        } else if (type === 'E') {
          newAmount = Number(productStockAmount.amount) - Number(amount);
        }

        await ProductStockAmount.update(
          {
            product_id,
            size_id,
            amount: newAmount,
          },
          { fields, where: { product_id, size_id }, transaction }
        );
      };

      const stock_operation_products = await Promise.all(
        stockOperationsProducts.map(async p => {
          await updateProductStockAmount(p.product_id, p.size_id, p.amount);

          return {
            id: p.id,
            stock_operation_id: p.stock_operation_id,
            product_id: p.product_id,
            size_id: p.size_id,
            amount: p.amount,
          };
        })
      );

      await transaction.commit();

      return res.json({
        id,
        type,
        canceled,
        canceled_at,
        cancelation_user_id,
        stock_operation_products,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new StockOperationController();
