import { EmailJob } from '@/features/user/interfaces/User';
import { emailWorker } from '@/shared/workers/EmailWorker';
import { BaseQueue } from './BaseQueue';

class EmailQueue extends BaseQueue {
  constructor() {
    super('Emails');
    this.processJob('forgotPasswordEmail', 5, emailWorker.addNotificationEmail);
  }

  public addEmailJob(name: string, data: EmailJob): void {
    this.addJob(name, data);
  }
}

export const emailQueue = new EmailQueue();
