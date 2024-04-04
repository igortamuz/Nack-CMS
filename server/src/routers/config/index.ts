import { Route } from "routers/types";
import { createConfig, editConfig, getConfig } from "controllers/config"
import auth from "middleware/auth";
import isAdmin from "middleware/admin";

export const route: Route[] = [
  {
    method: 'put',
    path: '/dashboard/system/config',
    middleware: [auth, isAdmin],
    handler: editConfig
  },
  {
    method: 'get',
    path: '/dashboard/system/config',
    middleware: [auth, isAdmin],
    handler: getConfig
  },
  {
    method: 'post',
    path: '/dashboard/system/config',
    middleware: [auth, isAdmin],
    handler: createConfig
  }
]