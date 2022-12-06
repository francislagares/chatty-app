import { User } from '@/features/user/interfaces/User';
import { ObjectId } from 'mongodb';

declare global {
  namespace Express {
    interface Request {
      currentUser?: AuthPayload;
    }
  }
}

export interface AuthPayload {
  userId?: string;
  uId?: string;
  email: string;
  username: string;
  avatarColor?: string;
  iat?: number;
}

export interface Auth {
  id: string | ObjectId;
  uId: string;
  username: string;
  email: string;
  password?: string;
  avatarColor: string;
  createdAt: Date;
  passwordResetToken?: string;
  passwordResetExpires?: number | string;
  comparePassword?: (password: string) => Promise<boolean>;
  hashPassword?: (password: string) => Promise<string>;
}

export interface SignUpData {
  id: ObjectId;
  uId: string;
  email: string;
  username: string;
  password: string;
  avatarColor: string;
}

export interface AuthJob {
  value?: string | Auth | User;
}
