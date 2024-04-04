import { Route } from "routers/types";
import { authorizeTicket, createBuyOrder, createOrder, deleteOrder, getPendingTickets, payWithMP } from "controllers/order"
import auth from "middleware/auth";
import isAdmin from "middleware/admin";

export const route: Route[] = [
  {
    method: 'get',
    path: '/order/pending',
    middleware: [auth, isAdmin],
    handler: getPendingTickets
  },
  {
    method: 'post',
    path: '/order/authorize',
    middleware: [auth, isAdmin],
    handler: authorizeTicket
  },
  {
    method: 'post',
    path: '/order',
    middleware: [auth],
    handler: createOrder
  },
  {
    method: 'delete',
    path: '/order/delete/:id',
    middleware: [auth, isAdmin],
    handler: deleteOrder
  },
  {
    method: 'post',
    path: '/payment/order/create',
    middleware: [auth],
    handler: createBuyOrder
  },
  {
    method: 'post',
    path: '/payment/finish',
    middleware: [auth],
    handler: payWithMP
  },
  
]