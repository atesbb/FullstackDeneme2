// Types shared between frontend and backend

export interface Movie {
  _id: string;
  objectID: string;
  title: string;
  alternative_titles: string[];
  year: number;
  image: string;
  color: string;
  score: number;
  rating: number;
  actors: string[];
  actor_facets: string[];
  genre: string[];
}

export interface CreateMovie {
  title: string;
  alternative_titles: string[];
  year: number;
  image: string;
  color: string;
  score: number;
  rating: number;
  actors: string[];
  actor_facets: string[];
  genre: string[];
}

export type UpdateMovie = Partial<CreateMovie>;

export enum MovieErrorCodes {
  alreadyExists = 'MOVIE.ALREADY_EXISTS',
  notFound = 'MOVIE.NOT_FOUND',
}
