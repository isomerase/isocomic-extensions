export interface Doc {
  _id: string;
  title: string;
  order: number;
  updated_at: string;
  id: string;
}

export interface Eps {
  docs: Doc[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface Data {
  eps: Eps;
}

export interface RootObject {
  code: number;
  message: string;
  data: Data;
}

