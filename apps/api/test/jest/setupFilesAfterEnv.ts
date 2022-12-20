import { MongodbConfig } from '../../src/app/configs/mongodb.config';
import { AlgoliaConfig } from '../../src/app/configs/algolia.config';

beforeAll(async (): Promise<any> => {
  if (!AlgoliaConfig.moviesIndex.startsWith('test-')) {
    throw new Error(
      'Algolia movies index name must be prefixed a "test-" word to avoid writing to your main index and for extra safety.'
    );
  }
  if (!MongodbConfig.dbName.startsWith('test-')) {
    throw new Error(
      'Mongo database name must be prefixed a "test-" to avoid writing to your main database and for extra safety.'
    );
  }
});
