import { authService } from '@/shared/services/db/AuthService';
import { DoneCallback, Job } from 'bull';
import logger from '@/utils/logger';

class AuthWorker {
  async addAuthUserToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;

      // add method to send data to database
      await authService.createAuthUser(value);

      job.progress(100);

      done(null, job.data);
    } catch (err) {
      logger.error(err);

      done(err as Error);
    }
  }
}

export const authWorker = new AuthWorker();
