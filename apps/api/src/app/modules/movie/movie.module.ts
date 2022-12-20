import { Logger, Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MovieModel, MovieSchema } from './movie.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AlgoliaModule } from 'nestjs-algolia';
import { AlgoliaConfig } from '../../configs/algolia.config';
import { MovieIndexer } from './movie.indexer';
import { MovieCliController } from './movie.cli-controller';

@Module({
  imports: [
    AlgoliaModule.register({
      applicationId: AlgoliaConfig.applicationId,
      apiKey: AlgoliaConfig.apiKey,
    }),
    MongooseModule.forFeature([{ name: MovieModel.name, schema: MovieSchema }]),
  ],
  controllers: [MovieController],
  providers: [Logger, MovieService, MovieIndexer, MovieCliController],
  exports: [],
})
export class MovieModule {}
