import { DoneCallback, Job } from 'bull';
import logger from '@/utils/logger';
import { mailTransport } from '@/shared/services/emails/MailTransport';

class EmailWorker {
  async addNotificationEmail(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { template, receiverEmail, subject } = job.data;

      await mailTransport.sendEmail(receiverEmail, subject, template);

      job.progress(100);

      done(null, job.data);
    } catch (err) {
      logger.error(err);

      done(err as Error);
    }
  }
}

export const emailWorker = new EmailWorker();
