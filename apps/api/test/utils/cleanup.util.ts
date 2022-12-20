import { AlgoliaConfig } from '../../src/app/configs/algolia.config';
import { Model } from 'mongoose';
import algoliasearch from 'algoliasearch';

// Cleanup database and index after each test
export const cleanup = async (model: Model<any>, indexName: string) => {
  await model.deleteMany({});
  await algoliasearch(AlgoliaConfig.applicationId, AlgoliaConfig.apiKey)
    .initIndex(indexName)
    .clearObjects();
};
