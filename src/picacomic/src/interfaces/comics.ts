interface Thumb {
  originalName: string;
  path: string;
  fileServer: string;
}

interface Doc {
  _id: string;
  title: string;
  author: string;
  totalViews: number;
  totalLikes: number;
  pagesCount: number;
  epsCount: number;
  finished: boolean;
  categories: string[];
  thumb: Thumb;
  id: string;
  likesCount: number;
}

interface Comics {
  docs: Doc[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

interface Data {
  comics: Comics;
}

export interface RootObject {
  code: number;
  message: string;
  data: Data;
}
