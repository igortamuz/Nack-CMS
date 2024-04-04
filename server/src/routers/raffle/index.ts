import { Route } from "routers/types";
import {
  getAll,
  getAvailable,
  getOneById,
  editRaffle,
  createRaffle,
  endRaffle,
  getUserRaffles,
  changeRaffleStatus,
  getLastWinners,
  deleteRaffle
} from "controllers/raffle"
import auth from "middleware/auth";
import isAdmin from "middleware/admin";

export const route: Route[] = [
  {
    method: 'get',
    path: '/raffle',
    middleware: [],
    handler: getAvailable
  },
  {
    method: 'get',
    path: '/ganhadores',
    middleware: [],
    handler: getLastWinners
  },
  {
    method: 'get',
    path: '/raffle/all',
    middleware: [auth, isAdmin],
    handler: getAll
  },
  {
    method: 'get',
    path: '/raffle/client',
    middleware: [auth],
    handler: getUserRaffles
  },
  {
    method: 'get',
    path: '/raffle/:id',
    middleware: [],
    handler: getOneById
  },
  {
    method: 'put',
    path: '/raffle/:id',
    middleware: [auth, isAdmin],
    handler: editRaffle
  },
  {
    method: 'put',
    path: '/raffle/status/:id',
    middleware: [auth, isAdmin],
    handler: changeRaffleStatus
  },
  {
    method: 'post',
    path: '/raffle',
    middleware: [auth, isAdmin],
    handler: createRaffle
  },
  {
    method: 'post',
    path: '/raffle/finalizar',
    middleware: [auth, isAdmin],
    handler: endRaffle
  },
  {
    method: 'delete',
    path: '/raffle/remover/:id',
    middleware: [auth, isAdmin],
    handler: deleteRaffle
  }
]