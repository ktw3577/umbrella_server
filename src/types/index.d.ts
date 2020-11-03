import UserModel from '../model/models/user';

declare global {
  namespace Express {
    export interface User extends UserModel {}
  }
  namespace UserNS {
    export interface User extends UserModel {}
  }
}
