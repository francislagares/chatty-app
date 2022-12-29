/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { joiValidation } from '@/shared/global/decorators/JoiValidation';
import { authService } from '@/shared/services/db/AuthService';
import { BadRequestError } from '@/shared/global/helpers/ErrorHandler';
import { loginSchema } from '@/features/auth/schemas/signin';

export class SignIn {
  @joiValidation(loginSchema)
  public async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    const existingUser = await authService.getUserByUsername(username);

    if (!existingUser) {
      throw new BadRequestError('User does not exist');
    }

    const passwordsMatch = compareHash(password, existingUser.password);

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials.');
    }

    const userJwt = jwt.sign(
      {
        userId: existingUser.id,
        uId: existingUser.uId,
        email: existingUser.email,
        password: existingUser.password,
        avatarColor: existingUser.avatarColor,
      },
      config.JWT_TOKEN,
    );
    req.session = { jwt: userJwt };
    res.status(HTTP_STATUS.OK).json({
      message: 'User logged in successfully',
      user: existingUser,
      token: userJwt,
    });
  }
}
