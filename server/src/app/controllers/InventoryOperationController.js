import * as Yup from 'yup';
import InventoryOperation from '../models/InventoryOperation';
import InventoryOperationProduct from '../models/InventoryOperationProduct';
import ProductInventoryQuantity from '../models/ProductInventoryQuantity';
import User from '../models/User';

import Database from '../../database';

class InventoryOperationController {
  async index(req, res) {
    const attributes = ['id', 'type', 'date', 'canceled', 'canceled_at'];

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
      inventory_operation_products: Yup.array()
        .of(
          Yup.object().shape({
            product_id: Yup.number().required(),
            size_id: Yup.number(),
            quantity: Yup.number()
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
      const { id, user_id, type, date } = await InventoryOperation.create(
        {
          user_id: req.userId,
          type: req.body.type,
          date: req.body.date,
        },
        { transaction }
      );

      const reqProduct = req.body.inventory_operation_products.map(p => {
        return {
          inventory_operation_id: id,
          ...p,
        };
      });

      const resProduct = await InventoryOperationProduct.bulkCreate(
        reqProduct,
        { transaction }
      );

      const updateProductInventoryQuantity = async (
        product_id,
        size_id,
        quantity
      ) => {
        const fields = [
          'product_id',
          'size_id',
          'quantity',
          'created_at',
          'updated_at',
        ];

        const productInventoryQuantity = await ProductInventoryQuantity.findOne(
          {
            where: { product_id, size_id },
            attributes: ['product_id', 'size_id', 'quantity'],
          }
        );

        if (productInventoryQuantity) {
          let newQuantity;

          if (type === 'E') {
            newQuantity =
              Number(productInventoryQuantity.quantity) + Number(quantity);
          } else if (type === 'S') {
            newQuantity =
              Number(productInventoryQuantity.quantity) - Number(quantity);
          }

          await ProductInventoryQuantity.update(
            {
              product_id,
              size_id,
              quantity: newQuantity,
            },
            { fields, where: { product_id, size_id }, transaction }
          );
        } else {
          await ProductInventoryQuantity.create(
            {
              product_id,
              size_id,
              quantity,
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
          await updateProductInventoryQuantity(
            p.product_id,
            p.size_id,
            p.quantity
          );

          return {
            id: p.id,
            inventory_operation_id: p.inventory_operation_id,
            product_id: p.product_id,
            size_id: p.size_id,
            quantity: p.quantity,
          };
        })
      );

      await transaction.commit();

      return res.json({
        id,
        user_id,
        type,
        date,
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
          attributes: ['product_id', 'size_id', 'quantity'],
          transaction,
        }
      );

      const updateProductInventoryQuantity = async (
        product_id,
        size_id,
        quantity
      ) => {
        const fields = [
          'product_id',
          'size_id',
          'quantity',
          'created_at',
          'updated_at',
        ];

        const productInventoryQuantity = await ProductInventoryQuantity.findOne(
          {
            where: { product_id, size_id },
            attributes: ['product_id', 'size_id', 'quantity'],
          }
        );

        let newQuantity;

        if (type === 'S') {
          newQuantity =
            Number(productInventoryQuantity.quantity) + Number(quantity);
        } else if (type === 'E') {
          newQuantity =
            Number(productInventoryQuantity.quantity) - Number(quantity);
        }

        await ProductInventoryQuantity.update(
          {
            product_id,
            size_id,
            quantity: newQuantity,
          },
          { fields, where: { product_id, size_id }, transaction }
        );
      };

      const inventory_operation_products = await Promise.all(
        inventoryOperationsProducts.map(async p => {
          await updateProductInventoryQuantity(
            p.product_id,
            p.size_id,
            p.quantity
          );

          return {
            id: p.id,
            inventory_operation_id: p.inventory_operation_id,
            product_id: p.product_id,
            size_id: p.size_id,
            quantity: p.quantity,
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
