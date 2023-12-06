import multer from 'multer';
import multerS3 from 'multer-s3';
import crypto from 'crypto';
import { extname, resolve } from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import bucket from './bucket';

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, resolve(__dirname, '..', '..', 'tmp', 'uploads'));
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) return cb(err);

        file.key = hash.toString('hex') + extname(file.originalname);

        return cb(null, file.key);
      });
    },
  }),
  bucket: multerS3({
    s3: new S3Client(bucket),
    bucket: process.env.BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) return cb(err);

        const fileName = hash.toString('hex') + extname(file.originalname);

        return cb(null, fileName);
      });
    },
  }),
};

export default {
  storage: storageTypes[process.env.IMAGE_STORAGE_TYPE],
};
