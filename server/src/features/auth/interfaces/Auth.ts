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
  password: string | null;
  avatarColor?: string;
  iat?: number;
  createdAt: Date;
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
