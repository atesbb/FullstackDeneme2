import { get } from 'env-var';
import * as dotenv from 'dotenv';
import path = require('path');

// Need this for "nestjs-console" module to get env variables properly
const envPath: string = path.resolve(process.env.PWD as string, '.env');
dotenv.config({ path: envPath });

export class AlgoliaConfig {
  static readonly applicationId: string = get('NX_ALGOLIA_APP_ID')
    .required()
    .asString();
  static readonly apiKey: string = get('ALGOLIA_API_KEY').required().asString();
  static readonly moviesIndex = get('NX_ALGOLIA_MOVIES_INDEX_NAME')
    .required()
    .asString();
}
