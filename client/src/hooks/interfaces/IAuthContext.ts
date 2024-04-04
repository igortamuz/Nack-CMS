import { ILoginCredentials } from './ILoginCredentials'
import { IUserData } from './IUserResponse';

export interface IAuthContext {
  user: IUserData;
  token: string;
  signIn(credentials: ILoginCredentials): Promise<boolean>
  signOut(): void;
  updateAuth(): void;
}