import multer, {StorageEngine} from 'multer'

import path from 'path';
import crypto from 'crypto';

const tmpFolder = path.resolve(__dirname, '..', '..', 'public');
const uploadFolder = path.resolve(__dirname, '..', '..', 'public', 'uploads');

interface IUploadConfig {
  driver: 'disk';
  directory: string;
  uploads: string;
  multer: {
    storage: StorageEngine;
  };
  config: {
    disk: {};
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,
  directory: tmpFolder,
  uploads: uploadFolder,
  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(req, file, callback) {
        const filehash = crypto.randomBytes(10).toString('hex');

        const filename = `${filehash}-${file.originalname}`;
        return callback(null, filename);
      },
    }),
    fileFilter: (request: any, file: any, callback: any) => {
      const allowedMimes = [
        'image/gif',
        'image/jpeg',
        'image/png',
        'image/svg+xml',
      ];
      if (allowedMimes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new Error('Invalid file type.'));
      }
    },
  },
  config: {
    disk: {}
  },
} as IUploadConfig;