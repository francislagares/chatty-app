import fs from 'fs';
import ejs from 'ejs';
import { ResetPasswordParams } from '@/features/user/interfaces/User';

class ResetPasswordTemplate {
  public passwordResetConfirm(templateParams: ResetPasswordParams): string {
    const { username, email, ipAddress, date } = templateParams;

    return ejs.render(
      fs.readFileSync(__dirname + '/ResetPassword.ejs', 'utf8'),
      {
        username,
        email,
        ipAddress,
        date,
        image_url:
          'https://w7.pngwing.com/pngs/120/102/png-transparent-padlock-logo-computer-icons-padlock-technic-logo-password-lock.png',
      },
    );
  }
}

export const resetPasswordTemplate = new ResetPasswordTemplate();
