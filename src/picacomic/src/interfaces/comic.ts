interface Avatar {
  originalName: string;
  path: string;
  fileServer: string;
}

interface Creator {
  _id: string;
  gender: string;
  name: string;
  verified: boolean;
  exp: number;
  level: number;
  characters: string[];
  role: string;
  avatar: Avatar;
  title: string;
  slogan: string;
  character: string;
}

interface Thumb {
  originalName: string;
  path: string;
  fileServer: string;
}

interface Comic {
  _id: string;
  _creator: Creator;
  title: string;
  description: string;
  thumb: Thumb;
  author: string;
  chineseTeam: string;
  categories: string[];
  tags: string[];
  pagesCount: number;
  epsCount: number;
  finished: boolean;
  updated_at: Date;
  created_at: Date;
  allowDownload: boolean;
  allowComment: boolean;
  totalLikes: number;
  totalViews: number;
  viewsCount: number;
  likesCount: number;
  isFavourite: boolean;
  isLiked: boolean;
  commentsCount: number;
}

interface Data {
  comic: Comic;
}

export interface RootObject {
  code: number;
  message: string;
  data: Data;
}

