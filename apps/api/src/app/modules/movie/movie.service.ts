import { Injectable } from '@nestjs/common';
import { MovieModel, MovieDocument } from './movie.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMovie, UpdateMovie } from '@types';
import { MovieAlreadyExistsError, MovieNotFoundError } from './movie.errors';
import { Result } from '@badrap/result';
import { mongodbErrorCodes } from '../../libs/misc/mongodb.error-codes';
import { MovieIndexer } from './movie.indexer';

@Injectable()
export class MovieService {
  constructor(
    private readonly indexer: MovieIndexer,
    @InjectModel(MovieModel.name) private movieModel: Model<MovieDocument>
  ) {}

  async save(
    movie: CreateMovie
  ): Promise<Result<string, MovieAlreadyExistsError | Error>> {
    const movieDocument = new this.movieModel(movie);

    try {
      const savedMovie = await movieDocument.save();
      await this.indexer.index([savedMovie]);
      return Result.ok(savedMovie.id);
    } catch (err: any) {
      const movieWithThisTitleAlreadyExists =
        err.code === mongodbErrorCodes.duplicateKey && err.keyPattern?.title;
      if (movieWithThisTitleAlreadyExists) {
        return Result.err(new MovieAlreadyExistsError({ title: movie.title }));
      }
      throw err;
    }
  }

  async update(
    id: string,
    updateDto: UpdateMovie
  ): Promise<Result<string, MovieNotFoundError | Error>> {
    try {
      const movie = await this.movieModel.findOneAndUpdate(
        { _id: id, _deleted: false },
        { ...updateDto, _indexed: false }
      );
      if (!movie) {
        return Result.err(new MovieNotFoundError({ id }));
      }
      await this.indexer.updateOne(movie.objectID, updateDto);
      return Result.ok(movie.id);
    } catch (err) {
      return Result.err(err as Error);
    }
  }

  async delete(id: string): Promise<Result<string, Error>> {
    try {
      const movie = await this.movieModel.findOneAndUpdate(
        { _id: id, _deleted: false },
        { _deleted: true, _indexed: false }
      );
      if (!movie) {
        return Result.err(new MovieNotFoundError({ id }));
      }
      await this.indexer.delete([movie]);
      return Result.ok(id);
    } catch (err) {
      return Result.err(err as Error);
    }
  }
}
