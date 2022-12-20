import { InjectModel } from '@nestjs/mongoose';
import { moviesMockData } from '@types';
import { Model } from 'mongoose';
import { MovieModel, MovieDocument } from './movie.schema';
import { AlgoliaService } from 'nestjs-algolia';
import { AlgoliaConfig } from '../../configs/algolia.config';
import { Console, Command } from 'nestjs-console';

@Console()
export class MovieCliController {
  constructor(
    @InjectModel(MovieModel.name) private movieModel: Model<MovieDocument>,
    protected readonly algoliaService: AlgoliaService
  ) {}

  @Command({
    command: 'app:seed',
    description: 'Seed database and indexes with data',
  })
  async seedMovies() {
    console.log('Seeding database...');
    const movieModels = moviesMockData.map(
      (movie) => new this.movieModel(movie)
    );

    const documentsToIndex = movieModels.map((doc) => ({
      ...doc.toObject(),
      _indexed: undefined,
      _deleted: undefined,
      __v: undefined,
    }));

    await this.movieModel.bulkSave(movieModels);
    const index = this.algoliaService.initIndex(AlgoliaConfig.moviesIndex);
    const res = await index.addObjects(documentsToIndex);
    console.log(`Seeded ${res.objectIDs.length} items`);
  }
}
