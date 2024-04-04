import { IState } from "./IState";
import { IUserData } from "./IUserResponse";

export interface IUser extends IState{
  user: IUserData,
}