import { MovieErrorCodes } from '@types';
import { ErrorBase } from '../../libs/errors/error.base';

export class MovieAlreadyExistsError extends ErrorBase {
  readonly code = MovieErrorCodes.alreadyExists;

  static message = 'Movie with this title already exists';

  constructor(metadata?: unknown) {
    super(MovieAlreadyExistsError.message, metadata);
  }
}

export class MovieNotFoundError extends ErrorBase {
  readonly code = MovieErrorCodes.notFound;

  static message = 'Movie not found';

  constructor(metadata?: unknown) {
    super(MovieNotFoundError.message, metadata);
  }
}
