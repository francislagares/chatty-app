import database from '@/config/database';
import { User } from '@prisma/client';

class UserService {
  public async addUserData(data: User): Promise<void> {
    await database.user.create({
      data,
    });
  }
}

export const userService = new UserService();
