import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AlgoliaService } from 'nestjs-algolia';
import { AlgoliaConfig } from '../../configs/algolia.config';
import { IndexerService } from '../indexer/indexer.service';
import { MovieModel, MovieDocument } from './movie.schema';

@Injectable()
export class MovieIndexer extends IndexerService<MovieDocument> {
  constructor(
    protected readonly algoliaService: AlgoliaService,
    @InjectModel(MovieModel.name) protected model: Model<MovieDocument>,
    @Inject(Logger) protected readonly logger: LoggerService
  ) {
    super();
  }
  protected indexName: string = AlgoliaConfig.moviesIndex;
}
