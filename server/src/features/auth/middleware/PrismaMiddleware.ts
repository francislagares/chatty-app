import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const encryptPassword: Prisma.Middleware = async (params, next) => {
  if (params.model === 'Auth') {
    if (params.action === 'create' || params.action === 'update') {
      if (params.args.data.password) {
        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(params.args.data.password, salt);
        params.args.data.password = hashPass;
      }
    }
  }
  return next(params);
};
