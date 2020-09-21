import ProductStockAmount from '../models/ProductStockAmount';

class ProductStockAmountController {
  async index(req, res) {
    if (!req.query.productId || !req.query.sizeId) {
      return res.status(400).json({
        error: 'Product and size IDs request params must have value.',
      });
    }

    const coupon = await ProductStockAmount.findOne({
      attributes: ['amount'],
      where: {
        product_id: req.query.productId,
        size_id: req.query.sizeId,
      },
    });

    return coupon ? res.json(coupon) : res.json({ amount: 0 });
  }
}

export default new ProductStockAmountController();
