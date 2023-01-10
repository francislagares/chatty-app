import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import { config } from '@/config';
import { authService } from '@/shared/services/db/AuthService';
import { BadRequestError } from '@/shared/global/helpers/ErrorHandler';
import { joiValidation } from '@/shared/global/decorators/JoiValidation';
import { emailSchema, passwordSchema } from '@/features/auth/schemas/password';
import { forgotPasswordTemplate } from '@/shared/services/emails/templates/forgot-password/ForgotPassword';
import { emailQueue } from '@/shared/services/queues/EmailQueue';
import { ResetPasswordParams } from '@/features/user/interfaces/User';
import crypto from 'crypto';
import publicIP from 'ip';
import dayjs from 'dayjs';
import { resetPasswordTemplate } from '@/shared/services/emails/templates/reset-password/ResetPassword';

export class Password {
  @joiValidation(emailSchema)
  public async updatePassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    const existingUser = await authService.getUserByEmail(email);

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials.');
    }

    const randomBytes = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters = randomBytes.toString('hex');
    const expiryDate = Date.now() * 60 * 60 * 1000;

    await authService.updatePasswordToken(
      `${existingUser.id}`,
      randomCharacters,
      expiryDate.toString(),
    );

    const resetLink = `${config.CLIENT_URL}/reset-password?token=${randomCharacters}`;
    const template = forgotPasswordTemplate.passwordResetTemplate(
      existingUser.username,
      resetLink,
    );

    emailQueue.addEmailJob('forgotPasswordEmail', {
      template,
      receiverEmail: email,
      subject: 'Reset your password',
    });

    res.status(HTTP_STATUS.OK).json({ message: 'Password reset email sent.' });
  }

  @joiValidation(passwordSchema)
  public async resetPassword(req: Request, res: Response): Promise<void> {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;

    if (password !== confirmPassword) {
      throw new BadRequestError('Passwords do not match.');
    }

    const existingUser = await authService.getUserByToken(token);

    if (!existingUser) {
      throw new BadRequestError('Reset token has expired.');
    }

    await authService.resetPasswordToken(
      `${existingUser.id}`,
      password,
      null,
      null,
    );

    const templateParams: ResetPasswordParams = {
      username: existingUser.username,
      email: existingUser.email,
      ipAddress: publicIP.address(),
      date: dayjs().format('DD-MM-YYYY HH:mm'),
    };

    const template = resetPasswordTemplate.passwordResetConfirm(templateParams);
    emailQueue.addEmailJob('forgotPasswordEmail', {
      template,
      receiverEmail: existingUser.email,
      subject: 'Password reset confirmation',
    });

    res
      .status(HTTP_STATUS.OK)
      .json({ message: 'Password successfully updated.' });
  }
}
