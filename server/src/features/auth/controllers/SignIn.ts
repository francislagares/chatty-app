import { ResetPasswordParams } from './../../user/interfaces/User';
import { userService } from '@/shared/services/db/UserService';
import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { joiValidation } from '@/shared/global/decorators/JoiValidation';
import { authService } from '@/shared/services/db/AuthService';
import { BadRequestError } from '@/shared/global/helpers/ErrorHandler';
import { loginSchema } from '@/features/auth/schemas/signin';
import { compareHash } from '@/utils/passwords';
import { emailQueue } from '@/shared/services/queues/EmailQueue';

import publicIP from 'ip';
import dayjs from 'dayjs';
import { resetPasswordTemplate } from '@/shared/services/emails/templates/reset-password/ResetPassword';
export class SignIn {
  @joiValidation(loginSchema)
  public async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    const existingUser = await authService.getUserByUsername(username);

    if (!existingUser) {
      throw new BadRequestError('User does not exist');
    }

    const passwordsMatch = compareHash(password, existingUser.password!);

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials.');
    }

    const user = await userService.getUserByAuthId(existingUser.userId!);

    const userJwt = jwt.sign(
      {
        userId: user.id,
        uId: existingUser.uId,
        email: existingUser.email,
        password: existingUser.password,
        avatarColor: existingUser.avatarColor,
      },
      config.JWT_TOKEN,
    );

    const templateParams: ResetPasswordParams = {
      username: existingUser.username,
      email: existingUser.email,
      ipAddress: publicIP.address(),
      date: dayjs().format('DD-MM-YYYY HH:mm'),
    };

    // const resetLink = `${config.CLIENT_URL}/reset-password?token=123413253`;
    const template = resetPasswordTemplate.passwordResetConfirm(templateParams);

    emailQueue.addEmailJob('forgotPasswordEmail', {
      template,
      receiverEmail: 'baylee18@ethereal.email',
      subject: 'Password reset confirmation',
    });

    req.session = { jwt: userJwt };

    const userDocument = {
      ...user,
      authId: existingUser.userId,
      username: existingUser.username,
      email: existingUser.email,
      avatarColor: existingUser.avatarColor,
      uId: existingUser.uId,
      createdAt: existingUser.createdAt,
    };

    res.status(HTTP_STATUS.OK).json({
      message: 'User logged in successfully',
      user: userDocument,
      token: userJwt,
    });
  }
}
