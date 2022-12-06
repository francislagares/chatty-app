import { DoneCallback, Job } from 'bull';
import logger from '@/utils/logger';
import { userService } from '@/shared/services/db/UserService';

class UserWorker {
  async addUserToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;

      // add method to send data to database
      await userService.addUserData(value);

      job.progress(100);

      done(null, job.data);
    } catch (err) {
      logger.error(err);

      done(err as Error);
    }
  }
}

export const userWorker = new UserWorker();
