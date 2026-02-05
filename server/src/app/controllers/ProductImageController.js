import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { unlinkSync } from 'fs';
import { resolve } from 'path';
import ProductImage from '../models/ProductImage';
import Product from '../models/Product';
import bucket from '../../config/bucket';

const s3 = new S3Client(bucket);

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
    const product = await Product.findByPk(req.params.productId);

    if (!product) {
      return res.status(404).json({ error: 'This product was not found.' });
    }

    if (!req.file) {
      return res.status(404).json({ error: 'Must upload a file.' });
    }

    const { originalname, filename, key } = req.file;

    const { id, product_id, url, name, path } = await ProductImage.create({
      product_id: product.id,
      name: originalname,
      path: process.env.IMAGE_STORAGE_TYPE === 'local' ? filename : key,
    });

    return res.json({ id, product_id, url, name, path });
  }

  async delete(req, res) {
    const product = await Product.findByPk(req.params.productId);

    if (!product) {
      return res.status(404).json({ error: 'This product was not found.' });
    }

    const image = await ProductImage.findOne({
      where: { id: req.params.id, product_id: req.params.productId },
    });

    if (image) {
      if (process.env.IMAGE_STORAGE_TYPE === 'local') {
        unlinkSync(
          resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', image.path)
        );
      } else {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: image.path,
          })
        );
      }

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
