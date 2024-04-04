import multer from "multer";
import { Route } from "../types";
import {getAll,
  createUser,
  removeOne,
  login,
  addUser,
  editUser,
  updateUser,
  getOneUser,
  getBalance,
  getSelfData,
  passwordRecoveryLink,
  recoveryVerify,
  newPassword,
  getUserAvatar
} from 'controllers/user'
import auth from 'middleware/auth'
import uploadConfig from "middleware/upload"
import isAdmin from "middleware/admin";

const upload = multer(uploadConfig.multer)

export const route: Route[] = [
  {  
    method: 'get',
    path: '/user',
    middleware: [auth, isAdmin],
    handler: getAll
  },
  {
    method: 'get',
    path: '/user/self',
    middleware: [auth],
    handler: getSelfData
  },
  {
    method: 'get',
    path: '/user/balance',
    middleware: [auth],
    handler: getBalance
  },
  {  
    method: 'get',
    path: '/user/avatar',
    middleware: [auth],
    handler: getUserAvatar
  },
  {  
    method: 'get',
    path: '/user/:id',
    middleware: [auth, isAdmin],
    handler: getOneUser
  },
  {
    method: 'post',
    path: '/user/add',
    middleware: [auth, isAdmin],
    handler: addUser
  },
  {
    method: 'post',
    path: '/user',
    middleware: [upload.single('avatar')],
    handler: createUser
  },
  {
    method: 'put',
    path: '/user/edit',
    middleware: [auth, isAdmin],
    handler: editUser
  },
  {
    method: 'put',
    path: '/user/update',
    middleware: [auth, upload.single('avatar')],
    handler: updateUser
  },
  {
    method: 'delete',
    path: '/user/:id',
    middleware: [auth, isAdmin],
    handler: removeOne
  },
  {
    method: 'post',
    path: '/login',
    middleware: [],
    handler: login
  },
  {
    method: 'post',
    path: '/recovery/password/generate',
    middleware: [],
    handler: passwordRecoveryLink
  },
  {
    method: 'post',
    path: '/recovery/password/newPassword',
    middleware: [],
    handler: newPassword
  },
  {
    method: 'get',
    path: '/recovery/password/verify/:recovery',
    middleware: [],
    handler: recoveryVerify
  }
]