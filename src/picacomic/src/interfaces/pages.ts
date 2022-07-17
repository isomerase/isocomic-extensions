export interface Media {
  originalName: string;
  path: string;
  fileServer: string;
}

export interface Doc {
  _id: string;
  media: Media;
  id: string;
}

export interface Pages {
  docs: Doc[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface Ep {
  _id: string;
  title: string;
}

export interface Data {
  pages: Pages;
  ep: Ep;
}

export interface RootObject {
  code: number;
  message: string;
  data: Data;
}


