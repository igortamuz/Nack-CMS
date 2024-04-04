import {Request, Response, RequestHandler as Middleware} from 'express'
// import {IAuthUserRequest} from 'interface/request'

export interface IAuthUser {
  affiliatedTo?: string;
  _id?: string;
  name: string;
  email: string;
  avatar?: string;
  balance: number;
  role: string;
}

export interface IAuthUserRequest extends Request {
  user?: IAuthUser;
  token?: string;
}

type Method = 
  | 'get'
  | 'post'
  | 'patch'
  | 'put'
  | 'delete'
  | 'options';

export type Handler = (req: IAuthUserRequest, res: Response) => any

export type Route = {
  method: Method
  path: string
  middleware: Middleware[]
  handler: Handler
}