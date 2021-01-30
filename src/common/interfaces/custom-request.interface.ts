import { Request } from 'express';
import { User } from '@app/modules/user/user.entity';
export interface CustomRequest extends Request {
  authInstance: User;
}
