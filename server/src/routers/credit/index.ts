import multer from "multer";
import { Route } from "../types";
import {authorizeCredit, checkout, createPixCreditOrder, deleteCredit, getPendingCredits, getUserPendingCredits, paymentFailure, paymentPending, paymentReceipt, paymentSuccess, payPendingCredits} from 'controllers/credit'
import auth from '../../middleware/auth'
import isAdmin from "middleware/admin";
import uploadConfig from "middleware/upload"

const upload = multer(uploadConfig.multer)

export const route: Route[] = [
  {
    method: 'post',
    path: '/payment/credit/checkout',
    middleware: [auth],
    handler: checkout
  },
  {
    method: 'get',
    path: '/payment/credit/success',
    middleware: [],
    handler: paymentSuccess
  },
  {
    method: 'get',
    path: '/payment/credit/failure',
    middleware: [],
    handler: paymentFailure
  },
  {
    method: 'get',
    path: '/payment/credit/pending',
    middleware: [],
    handler: paymentPending
  },
  {
    method: 'get',
    path: '/payment/credit/pay/:id',
    middleware: [auth],
    handler: payPendingCredits
  },
  {
    method: 'get',
    path: '/credit/pending/self',
    middleware: [auth],
    handler: getUserPendingCredits
  },
  {
    method: 'get',
    path: '/credit/pending',
    middleware: [auth, isAdmin],
    handler: getPendingCredits
  },
  {
    method: 'post',
    path: '/credit/authorize',
    middleware: [auth, isAdmin],
    handler: authorizeCredit
  },
  {
    method: 'delete',
    path: '/credit/delete/:id',
    middleware: [auth, isAdmin],
    handler: deleteCredit
  },
  {
    method: 'post',
    path: '/credit/receipt',
    middleware: [auth, upload.single('receipt')],
    handler: paymentReceipt
  },
  {
    method: 'post',
    path: '/credit/pay/pix',
    middleware: [auth],
    handler: createPixCreditOrder
  },
]