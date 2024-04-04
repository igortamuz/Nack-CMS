import { Route } from "routers/types";
import {
  reportByUserRaffle
} from "controllers/report"
import auth from "middleware/auth";
import isAdmin from "middleware/admin";

export const route: Route[] = [
  {
    method: 'get',
    path: '/report/raffle/:raffleId',
    middleware: [auth, isAdmin],
    handler: reportByUserRaffle
  }
]