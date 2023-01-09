import { UserJob } from '@/features/user/interfaces/User';
import { userWorker } from '@/shared/workers/UserWorker';
import { BaseQueue } from './BaseQueue';

class UserQueue extends BaseQueue {
  constructor() {
    super('User');
    this.processJob('addUserToDB', 5, userWorker.addUserToDB);
  }

  public addUserJob(name: string, data: UserJob) {
    this.addJob(name, data);
  }
}

export const userQueue = new UserQueue();
