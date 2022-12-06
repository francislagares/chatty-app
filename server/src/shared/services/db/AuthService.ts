import { Helpers } from '@/shared/global/helpers/Helpers';
import database from '@/config/database';
import { AuthPayload } from '@/features/auth/interfaces/Auth';
import { Auth } from '@prisma/client';

class AuthService {
  public async createAuthUser(data: Auth): Promise<void> {
    await database.auth.create({
      data,
    });
  }

  public async getUserByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<AuthPayload | null> {
    const user = database.auth.findFirst({
      where: {
        OR: [
          {
            username: {
              contains: `${Helpers.firstLetterUppercase(username)}`,
            },
          },
          {
            email: {
              contains: `${Helpers.lowerCase(email)}`,
            },
          },
        ],
      },
    });

    return user;
  }
}

export const authService = new AuthService();
