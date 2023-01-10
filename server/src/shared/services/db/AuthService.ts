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

  public async updatePasswordToken(
    authId: string,
    token: string,
    tokenExpiration: string,
  ): Promise<void> {
    await database.auth.update({
      where: {
        id: authId,
      },
      data: {
        passwordResetToken: token,
        passwordResetExpires: tokenExpiration,
      },
    });
  }

  public async resetPasswordToken(
    authId: string,
    password: string,
    token: string | null,
    tokenExpiration: string | null,
  ): Promise<void> {
    await database.auth.update({
      where: {
        id: authId,
      },
      data: {
        password,
        passwordResetToken: token,
        passwordResetExpires: tokenExpiration,
      },
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

  public async getUserByUsername(
    username: string,
  ): Promise<AuthPayload | null> {
    const user = database.auth.findFirst({
      where: {
        username: {
          contains: `${Helpers.firstLetterUppercase(username)}`,
        },
      },
    });

    return user;
  }

  public async getUserByEmail(email: string): Promise<Auth | null> {
    const user = database.auth.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  public async getUserByToken(token: string): Promise<Auth | null> {
    const user = database.auth.findFirst({
      where: {
        AND: [
          {
            passwordResetToken: token,
          },
          {
            passwordResetExpires: {
              gt: Date.now().toString(),
            },
          },
        ],
      },
    });

    return user;
  }
}

export const authService = new AuthService();
