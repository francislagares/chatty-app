import database from '@/config/database';
import { NotFoundError } from '@/shared/global/helpers/ErrorHandler';
import { User } from '@prisma/client';

class UserService {
  public async addUserData(data: User): Promise<void> {
    await database.user.create({
      data,
    });
  }

  public async getUserById(id: string): Promise<User> {
    const user = await database.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    return user;
  }
}

export const userService = new UserService();
