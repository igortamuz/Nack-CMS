import { Route } from "./types";
import {route as user} from "./user"
import {route as raffle} from "./raffle"
import {route as slot} from './slot'
import {route as order} from './order'
import {route as payment} from './payment'
import {route as imageUpload} from './image'
import {route as config} from './config'
import {route as affiliate} from './affiliate'
import {route as credit} from './credit'
import {route as report} from './report'

export const routes: Route[] = [
  ...user,
  ...raffle,
  ...slot,
  ...order,
  ...payment,
  ...imageUpload,
  ...config,
  ...affiliate,
  ...credit,
  ...report
]