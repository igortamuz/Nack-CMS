import { Route } from "routers/types";
import { getAffiliates, getExtract } from "controllers/affiliate";
import auth from "middleware/auth";
// import isAdmin from "middleware/admin";

export const route: Route[] = [
  {
    method: 'get',
    path: '/client/affiliate/extract',
    middleware: [auth],
    handler: getExtract
  },
  {
    method: 'get',
    path: '/client/affiliate/list',
    middleware: [auth],
    handler: getAffiliates
  },
]