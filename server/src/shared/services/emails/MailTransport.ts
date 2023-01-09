import { BadRequestError } from '@/shared/global/helpers/ErrorHandler';
import nodemailer from 'nodemailer';
import logger from '@/utils/logger';
import sendGridMail from '@sendgrid/mail';
import { config } from '@/config';

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

sendGridMail.setApiKey(config.SENDGRID_API_KEY!);

class MailTransport {
  public async sendEmail(
    receiverEmail: string,
    subject: string,
    body: string,
  ): Promise<void> {
    if (config.NODE_ENV === 'test' || config.NODE_ENV === 'development') {
      this.developmentEmailSender(receiverEmail, subject, body);
    } else {
      this.productionEmailSender(receiverEmail, subject, body);
    }
  }

  private async developmentEmailSender(
    receiverEmail: string,
    subject: string,
    body: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD,
      },
    });

    const mailOptions: MailOptions = {
      from: `Chatty App <${config.SENDER_EMAIL}>`,
      to: receiverEmail,
      subject,
      html: body,
    };

    try {
      await transporter.sendMail(mailOptions);
      logger.info('Development email sent successfully.');
    } catch (error) {
      logger.error('Error sending email', error);
      throw new BadRequestError('Error sending email');
    }
  }

  private async productionEmailSender(
    receiverEmail: string,
    subject: string,
    body: string,
  ): Promise<void> {
    const mailOptions: MailOptions = {
      from: `Chatty App <${config.SENDER_EMAIL}>`,
      to: receiverEmail,
      subject,
      html: body,
    };

    try {
      await sendGridMail.send(mailOptions);
      logger.info('Production email sent successfully.');
    } catch (error) {
      logger.error('Error sending email', error);
      throw new BadRequestError('Error sending email');
    }
  }
}

export const mailTransport = new MailTransport();
