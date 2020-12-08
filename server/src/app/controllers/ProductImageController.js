import { unlinkSync } from 'fs';
import { resolve } from 'path';
import ProductImage from '../models/ProductImage';
import Product from '../models/Product';

class ProductImageController {
  async index(req, res) {
    const images = await ProductImage.findAll({
      where: { product_id: req.params.productId },
      attributes: ['id', 'path', 'url'],
      order: ['id'],
    });

    return res.json(images);
  }

  async store(req, res) {
    const { id: productId } = await Product.findByPk(req.params.productId);

    if (!productId) {
      return res.status(404).json({ error: 'This product was not found.' });
    }

    if (!req.file) {
      return res.status(404).json({ error: 'Must upload a file.' });
    }

    const { originalname, filename } = req.file;

    const { id, product_id, url, name, path } = await ProductImage.create({
      product_id: productId,
      name: originalname,
      path: filename,
    });

    return res.json({ id, product_id, url, name, path });
  }

  async delete(req, res) {
    const product = await Product.findByPk(req.params.productId);

    if (!product) {
      return res.status(404).json({ error: 'This product was not found.' });
    }

    const image = await ProductImage.findByPk(req.params.id);

    if (image) {
      unlinkSync(
        resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', image.path)
      );
      await image.destroy();
    } else {
      return res.status(404).json({
        error: 'Image with this given ID was not found.',
      });
    }

    return res.json();
  }
}

export default new ProductImageController();
