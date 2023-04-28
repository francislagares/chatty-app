export interface PostDocument {
  id?: string;
  userId: string;
  post: string;
  bgColor: string;
  commentsCount: number;
  imgVersion?: string;
  imgId?: string;
  videoId?: string;
  videoVersion?: string;
  feelings?: string;
  gifUrl?: string;
  privacy?: string;
  createdAt?: Date;
}

export interface GetPostsQuery {
  id?: string;
  username?: string;
  imgId?: string;
  gifUrl?: string;
  videoId?: string;
}

export interface SavePostToCache {
  key: string;
  currentUserId: string;
  uId: string;
  createdPost: PostDocument;
}

export interface PostJobData {
  key?: string;
  value?: PostDocument;
  keyOne?: string;
  keyTwo?: string;
}

export interface QueryComplete {
  ok?: number;
  n?: number;
}

export interface QueryDeleted {
  deletedCount?: number;
}
