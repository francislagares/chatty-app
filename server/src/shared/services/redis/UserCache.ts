import { ServerError } from '@/shared/global/helpers/ErrorHandler';
import { User } from '@/features/user/interfaces/User';
import { BaseCache } from './BaseCache';

export class UserCache extends BaseCache {
  constructor() {
    super('UserCache');
  }

  public async saveUserToCache(
    key: string,
    userUId: string,
    createUser: User,
  ): Promise<void> {
    const createdAt = new Date();
    const {
      id,
      uId,
      username,
      email,
      avatarColor,
      blocked,
      blockedBy,
      postsCount,
      profilePicture,
      followersCount,
      followingCount,
      notifications,
      work,
      location,
      school,
      quote,
      bgImageId,
      bgImageVersion,
      social,
    } = createUser;
    const firstList: string[] = [
      'id',
      `${id}`,
      'uId',
      `${uId}`,
      'username',
      `${username}`,
      'email',
      `${email}`,
      'avatarColor',
      `${avatarColor}`,
      'createdAt',
      `${createdAt}`,
      'postsCount',
      `${postsCount}`,
    ];
    const secondList: string[] = [
      'blocked',
      JSON.stringify(blocked),
      'blockedBy',
      JSON.stringify(blockedBy),
      'profilePicture',
      `${profilePicture}`,
      'followersCount',
      `${followersCount}`,
      'followingCount',
      `${followingCount}`,
      'notifications',
      JSON.stringify(notifications),
      'social',
      JSON.stringify(social),
    ];
    const thirdList: string[] = [
      'work',
      `${work}`,
      'location',
      `${location}`,
      'school',
      `${school}`,
      'quote',
      `${quote}`,
      'bgImageVersion',
      `${bgImageVersion}`,
      'bgImageId',
      `${bgImageId}`,
    ];
    const dataToSave: string[] = [...firstList, ...secondList, ...thirdList];

    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      await this.client.ZADD('user', {
        score: parseInt(userUId, 10),
        value: `${key}`,
      });

      await this.client.HSET(`users:${key}`, dataToSave);
    } catch (err) {
      this.log.error(err);
      throw new ServerError('Server error. Try again.');
    }
  }
}
