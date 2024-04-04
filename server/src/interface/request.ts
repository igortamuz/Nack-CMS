import {Request} from 'express'

export interface IAuthUser {
  _id?: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface IAuthUserRequest extends Request {
  user?: IAuthUser;
  token?: string;
}