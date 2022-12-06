import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import { UploadApiResponse } from 'cloudinary';
import { config } from '@/config/index';
import { joiValidation } from '@/shared/global/decorators/JoiValidation';
import { BadRequestError } from '@/shared/global/helpers/ErrorHandler';
import { authService } from '@/shared/services/db/AuthService';
import { Helpers } from '@/shared/global/helpers/Helpers';
import { signupSchema } from '@/features/auth/schemas/signup';
import { User } from '@/features/user/interfaces/User';
import { Auth, SignUpData } from '@/features/auth/interfaces/Auth';
import { uploadImage } from '@/shared/global/helpers/CloudinaryUpload';
import { UserCache } from '@/shared/services/redis/UserCache';
import { authQueue } from '@/shared/services/queues/AuthQueue';
import { userQueue } from '@/shared/services/queues/UserQueue';
import { ObjectId } from 'mongodb';
import { omit } from 'lodash';
import jwt from 'jsonwebtoken';

const userCache = new UserCache();

export class SignUp {
  @joiValidation(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { username, email, password, avatarColor, avatarImage } = req.body;

    const userExists = await authService.getUserByUsernameOrEmail(
      username,
      email,
    );

    if (userExists) {
      throw new BadRequestError('User already exists');
    }

    const authObjectId = new ObjectId();
    const userObjectId = new ObjectId();
    const uId = `${Helpers.generateRandomIntegers(12)}`;

    // the reason we are using SignUp.prototype.signupData and not this.signupData is because
    // of how we invoke the create method in the routes method.
    // the scope of the this object is not kept when the method is invoked
    const authData: Auth = SignUp.prototype.signupData({
      id: authObjectId,
      uId,
      username,
      email,
      password,
      avatarColor,
    });

    const result: UploadApiResponse = (await uploadImage(
      avatarImage,
      `${userObjectId}`,
      true,
      true,
    )) as UploadApiResponse;
    if (!result?.public_id) {
      throw new BadRequestError('File upload: Error occurred. Try again.');
    }

    // Add to redis cache
    const userDataForCache = SignUp.prototype.userData(authData, userObjectId);
    userDataForCache.profilePicture = `https://res.cloudinary.com/${config.CLOUD_NAME}/image/upload/v${result.version}/${userObjectId}`;
    await userCache.saveUserToCache(`${userObjectId}`, uId, userDataForCache);

    // Add to database
    authQueue.addAuthUserJob('addAuthUserToDB', { value: authData });
    userQueue.addUserJob('addUserToDB', {
      value: omit(userDataForCache, [
        'uId',
        'username',
        'email',
        'avatarColor',
        'password',
      ]),
    });

    const userJwt = SignUp.prototype.signUpToken(authData, userObjectId);
    req.session = { jwt: userJwt };

    res.status(HTTP_STATUS.CREATED).json({
      message: 'User created successfully',
      user: userDataForCache,
      token: userJwt,
    });
  }

  private signUpToken(data: Auth, userObjectId: ObjectId): string {
    return jwt.sign(
      {
        userId: userObjectId,
        uId: data.uId,
        email: data.email,
        username: data.username,
        avatarColor: data.avatarColor,
      },
      config.JWT_TOKEN,
    );
  }

  private signupData(data: SignUpData) {
    const { id, username, email, uId, password, avatarColor } = data;
    return {
      id,
      uId,
      username: Helpers.firstLetterUppercase(username),
      email: Helpers.lowerCase(email),
      password,
      avatarColor,
      createdAt: new Date(),
    };
  }

  private userData(data: Auth, userObjectId: ObjectId): User {
    const { id, username, email, uId, password, avatarColor } = data;
    return {
      id: userObjectId,
      authId: id,
      uId,
      username: Helpers.firstLetterUppercase(username),
      email,
      password,
      avatarColor,
      profilePicture: '',
      blocked: [],
      blockedBy: [],
      work: '',
      location: '',
      school: '',
      quote: '',
      bgImageVersion: '',
      bgImageId: '',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true,
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: '',
      },
    } as unknown as User;
  }
}
