import fs from 'fs';
import ejs from 'ejs';

class ForgotPasswordTemplate {
  public passwordResetTemplate(username: string, resetLink: string): string {
    return ejs.render(
      fs.readFileSync(__dirname + '/ForgotPassword.ejs', 'utf8'),
      {
        username,
        resetLink,
        image_url:
          'https://w7.pngwing.com/pngs/120/102/png-transparent-padlock-logo-computer-icons-padlock-technic-logo-password-lock.png',
      },
    );
  }
}

export const forgotPasswordTemplate = new ForgotPasswordTemplate();
