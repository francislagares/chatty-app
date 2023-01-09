export interface User {
  id: string;
  authId: string;
  uId?: string;
  username?: string;
  email?: string;
  password?: string;
  avatarColor?: string;
  createdAt?: Date;
  postsCount: number;
  work: string;
  school: string;
  quote: string;
  location: string;
  blocked: string[];
  blockedBy: string[];
  followersCount: number;
  followingCount: number;
  notifications: NotificationSettings;
  social: SocialLinks;
  bgImageVersion: string;
  bgImageId: string;
  profilePicture: string;
}

export interface ResetPasswordParams {
  username: string;
  email: string;
  ipAddress: string;
  date: string;
}

export interface NotificationSettings {
  messages: boolean;
  reactions: boolean;
  comments: boolean;
  follows: boolean;
}

export interface BasicInfo {
  quote: string;
  work: string;
  school: string;
  location: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
}

export interface SocketData {
  blockedUser: string;
  blockedBy: string;
}

export interface Login {
  userId: string;
}

export interface UserJobInfo {
  key?: string;
  value?: string | SocialLinks;
}

export interface UserJob {
  keyOne?: string;
  keyTwo?: string;
  key?: string;
  value?: string | NotificationSettings | User;
}

export interface EmailJob {
  receiverEmail: string;
  template: string;
  subject: string;
}

export interface AllUsers {
  users: User[];
  totalUsers: number;
}
