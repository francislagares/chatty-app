import { AuthJob } from '@/features/auth/interfaces/Auth';
import { authWorker } from '@/shared/workers/AuthWorker';
import { BaseQueue } from './BaseQueue';

class AuthQueue extends BaseQueue {
  constructor() {
    super('Auth');
    this.processJob('addAuthUserToDB', 5, authWorker.addAuthUserToDB);
  }

  public addAuthUserJob(name: string, data: AuthJob) {
    this.addJob(name, data);
  }
}

export const authQueue = new AuthQueue();
