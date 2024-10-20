import { User } from '../../db/types';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
