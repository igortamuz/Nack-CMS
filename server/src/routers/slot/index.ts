import { Route } from "routers/types";
import {cancelSlot, getUserSlots, selectRaffleSlot} from "controllers/slot"
import auth from "middleware/auth";

export const route: Route[] = [
  {
    method: 'get',
    path: '/raffle/user/slots/:id',
    middleware: [auth],
    handler: getUserSlots
  },
  {
    method: 'post',
    path: '/raffle/:id/select',
    middleware: [auth],
    handler: selectRaffleSlot
  },
  {
    method: 'post',
    path: '/raffle/delete/slot',
    middleware: [auth],
    handler: cancelSlot
  }
]