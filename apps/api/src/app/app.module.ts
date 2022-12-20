import { Module } from '@nestjs/common';
import { MovieModule } from './modules/movie/movie.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongodbConfig } from './configs/mongodb.config';
import { ScheduleModule } from '@nestjs/schedule';
import { ConsoleModule } from 'nestjs-console';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(MongodbConfig.uri, {
      user: MongodbConfig.username,
      pass: MongodbConfig.password,
      dbName: MongodbConfig.dbName,
    }),
    ScheduleModule.forRoot(),
    ConsoleModule,
    MovieModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
