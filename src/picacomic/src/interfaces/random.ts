export interface Thumb {
  fileServer: string;
  path: string;
  originalName: string;
}

export interface Comic {
  _id: string;
  title: string;
  thumb: Thumb;
  author: string;
  categories: string[];
  finished: boolean;
  epsCount: number;
  pagesCount: number;
  totalViews: number;
  totalLikes: number;
  likesCount: number;
}

export interface Data {
  comics: Comic[];
}

export interface RootObject {
  code: number;
  message: string;
  data: Data;
}