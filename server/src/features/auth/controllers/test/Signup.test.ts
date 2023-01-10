/* eslint-disable jest/no-conditional-expect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { SignUp } from '@/features/auth/controllers/SignUp';
import { authMockRequest, authMockResponse } from '@/mocks/AuthMock';
import { CustomError } from '@/shared/global/helpers/ErrorHandler';

jest.useFakeTimers();
jest.mock('@/shared/services/queues/BaseQueue');
jest.mock('@/shared/services/redis/UserCache');
jest.mock('@/shared/services/queues/UserQueue');
jest.mock('@/shared/services/queues/AuthQueue');

describe('SignUp', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should throw an error if username is not available', async () => {
    const req: Request = authMockRequest(
      {},
      {
        username: '',
        email: 'francis@test.com',
        password: 'pass1234',
        avatarColor: 'blue',
        avatarImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEU',
      },
    ) as Request;
    const res: Response = authMockResponse();

    await SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual(
        'Username is a required field',
      );
    });
  });
});
