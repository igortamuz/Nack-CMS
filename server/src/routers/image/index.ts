import multer from 'multer'
import { Route } from "routers/types";
import auth from "middleware/auth";
import uploadConfig from "middleware/upload"
import { uploadImage, getAllImages, uploadRaffleImages } from "controllers/upload";
import isAdmin from 'middleware/admin';

const upload = multer(uploadConfig.multer)

export const route: Route[] = [
  {
    method: 'get',
    path: '/content/images',
    middleware: [auth],
    handler: getAllImages
  },
  {  
    method: 'post',
    path: '/upload/image',
    middleware: [auth, isAdmin, upload.single('image')],
    handler: uploadImage
  },
  {  
    method: 'post',
    path: '/upload/image/raffle',
    middleware: [auth, isAdmin, upload.array('images')],
    handler: uploadRaffleImages
  },
]