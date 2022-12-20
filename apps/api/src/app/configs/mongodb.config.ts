import { get } from 'env-var';

export class MongodbConfig {
  static readonly username: string = get('MONGODB_USERNAME')
    .required()
    .asString();
  static readonly password: string = get('MONGODB_PASSWORD')
    .required()
    .asString();
  static readonly uri: string = get('MONGODB_URI').required().asString();
  static readonly dbName: string = get('MONGODB_DB_NAME').required().asString();
}
