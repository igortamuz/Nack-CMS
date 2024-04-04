import multer from "multer";
import { Route } from "../types";
import {checkout, consultarPix, createPixOrder, getPixKeys, paymentFailure, paymentPending, paymentReceipt, paymentSuccess, payReservedTickets, payWithWallet} from 'controllers/payment'
import auth from '../../middleware/auth'
import uploadConfig from "middleware/upload"
import isAdmin from "middleware/admin";

const upload = multer(uploadConfig.multer)

export const route: Route[] = [
  {  
    method: 'get',
    path: '/payment/checkout/:id/:title/:description/:slotId',
    middleware: [auth],
    handler: checkout
  },
  {  
    method: 'get',
    path: '/payment/success',
    middleware: [],
    handler: paymentSuccess
  },
  {  
    method: 'get',
    path: '/payment/failure',
    middleware: [],
    handler: paymentFailure
  },
  {  
    method: 'get',
    path: '/payment/pending',
    middleware: [],
    handler: paymentPending
  },
  {
    method: 'get',
    path: '/payment/reserved/:id',
    middleware: [auth],
    handler: payReservedTickets
  },
  {
    method: 'post',
    path: '/payment/wallet',
    middleware: [auth],
    handler: payWithWallet
  },
  {
    method: 'post',
    path: '/payment/receipt',
    middleware: [auth, upload.single('receipt')],
    handler: paymentReceipt
  },
  {
    method: 'post',
    path: '/payment/pix/create',
    middleware: [auth],
    handler: createPixOrder
  },
  {
    method: 'get',
    path: '/payment/pix/retrieve/:id',
    middleware: [auth, isAdmin],
    handler: consultarPix
  },
  // {
  //   method: 'post',
  //   path: '/payment/pix/keys',
  //   middleware: [],
  //   handler: getPixKeys
  // },
  {
    method: 'get',
    path: '/payment/pix/keys',
    middleware: [],
    handler: getPixKeys
  }
]