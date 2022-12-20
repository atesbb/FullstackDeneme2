import { get } from 'env-var';

export const projectConfig = {
  indexerIntervalMs: get('INDEXER_INTERVAL_MS').required().asInt(),
  api: {
    prefix: 'api',
    version: 'v1',
    port: get('API_PORT').asPortNumber() || 3333,
  },
};

export const apiGlobalPrefix = `${projectConfig.api.prefix}/${projectConfig.api.version}`;
