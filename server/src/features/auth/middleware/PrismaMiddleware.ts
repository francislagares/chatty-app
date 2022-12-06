import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const hashPassword = () => {
  const prisma = new PrismaClient();

  prisma.$use(async (params: Prisma.MiddlewareParams, next) => {
    if (params.action === 'create' && params.model === 'Auth') {
      const user = params.args.data;
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(user.password, salt);
      user.password = hash;
      params.args.data = user;
    }
    return next(params);
  });
};
