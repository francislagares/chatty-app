import HTTP_STATUS from 'http-status-codes';
import { userService } from '@/shared/services/db/UserService';
import { UserCache } from '@/shared/services/redis/UserCache';
import { Request, Response } from 'express';

const userCache = new UserCache();

export class CurrentUser {
  public async getCurrentUser(req: Request, res: Response): Promise<void> {
    let isUser = false;
    let token = null;
    let user = null;

    const cachedUser = await userCache.getUserFromCache(
      `${req.currentUser?.userId}`,
    );

    const existingUser = cachedUser
      ? cachedUser
      : await userService.getUserById(`${req.currentUser?.userId}`);

    if (Object.keys(existingUser).length) {
      isUser = true;
      token = req.session?.jwt;
      user = existingUser;
    }
    res.status(HTTP_STATUS.OK).json({ token, isUser, user });
  }
}
