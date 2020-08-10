import * as Yup from 'yup';
import InventoryOperation from '../models/InventoryOperation';
import InventoryOperationProduct from '../models/InventoryOperationProduct';
import ProductInventoryAmount from '../models/ProductInventoryAmount';
import User from '../models/User';

import Database from '../../database';

class InventoryOperationController {
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
      const inventoryOperation = await InventoryOperation.findByPk(
        req.params.id,
        {
          attributes,
          include,
        }
      );

      return res.json(inventoryOperation);
    }

    const inventoryOperations = await InventoryOperation.findAll({
      attributes,
      order: [['date', 'DESC']],
      include,
    });

    return res.json(inventoryOperations);
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
      inventory_operation_products: Yup.array()
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
      } = await InventoryOperation.create(
        {
          user_id: req.userId,
          type: req.body.type,
          date: req.body.date,
          total_amount: req.body.total_amount,
        },
        { transaction }
      );

      let totalAmount = 0;

      const reqProduct = req.body.inventory_operation_products.map(p => {
        totalAmount += Number(p.amount);

        return {
          inventory_operation_id: id,
          ...p,
        };
      });

      const resProduct = await InventoryOperationProduct.bulkCreate(
        reqProduct,
        { transaction }
      );

      if (totalAmount !== total_amount) {
        return res.status(404).json({
          error: 'Total amount different from the sum of the product amounts.',
        });
      }

      const updateProductInventoryAmount = async (
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

        const productInventoryAmount = await ProductInventoryAmount.findOne({
          where: { product_id, size_id },
          attributes: ['product_id', 'size_id', 'amount'],
        });

        if (productInventoryAmount) {
          let newAmount;

          if (type === 'E') {
            newAmount = Number(productInventoryAmount.amount) + Number(amount);
          } else if (type === 'S') {
            newAmount = Number(productInventoryAmount.amount) - Number(amount);
          }

          await ProductInventoryAmount.update(
            {
              product_id,
              size_id,
              amount: newAmount,
            },
            { fields, where: { product_id, size_id }, transaction }
          );
        } else {
          await ProductInventoryAmount.create(
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

      const inventory_operation_products = await Promise.all(
        resProduct.map(async p => {
          await updateProductInventoryAmount(p.product_id, p.size_id, p.amount);

          return {
            id: p.id,
            inventory_operation_id: p.inventory_operation_id,
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
        inventory_operation_products,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async delete(req, res) {
    const inventoryOperation = await InventoryOperation.findByPk(req.params.id);

    if (!inventoryOperation) {
      return res.status(404).json({
        error: 'Inventory operation with this given ID was not found.',
      });
    }

    if (inventoryOperation.canceled) {
      return res.status(404).json({
        error: 'Inventory operation already canceled.',
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
      } = await inventoryOperation.update(
        {
          canceled: true,
          canceled_at: new Date(),
          cancelation_user_id: req.userId,
        },
        { transaction }
      );

      const inventoryOperationsProducts = await InventoryOperationProduct.findAll(
        {
          where: { inventory_operation_id: id },
          attributes: ['product_id', 'size_id', 'amount'],
          transaction,
        }
      );

      const updateProductInventoryAmount = async (
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

        const productInventoryAmount = await ProductInventoryAmount.findOne({
          where: { product_id, size_id },
          attributes: ['product_id', 'size_id', 'amount'],
        });

        let newAmount;

        if (type === 'S') {
          newAmount = Number(productInventoryAmount.amount) + Number(amount);
        } else if (type === 'E') {
          newAmount = Number(productInventoryAmount.amount) - Number(amount);
        }

        await ProductInventoryAmount.update(
          {
            product_id,
            size_id,
            amount: newAmount,
          },
          { fields, where: { product_id, size_id }, transaction }
        );
      };

      const inventory_operation_products = await Promise.all(
        inventoryOperationsProducts.map(async p => {
          await updateProductInventoryAmount(p.product_id, p.size_id, p.amount);

          return {
            id: p.id,
            inventory_operation_id: p.inventory_operation_id,
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
        inventory_operation_products,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new InventoryOperationController();
