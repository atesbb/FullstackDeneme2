import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import {
  MovieDocument,
  MovieModel,
  MovieSchema,
} from '../../src/app/modules/movie/movie.schema';
import { Model } from 'mongoose';
import { moviesMockData } from '@types';
import { AlgoliaService } from 'nestjs-algolia';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieErrorCodes } from '@types';
import { AlgoliaConfig } from '../../src/app/configs/algolia.config';
import { delay } from '../utils/delay.util';
import { SearchIndex } from 'algoliasearch';
import { cleanup } from '../utils/cleanup.util';

describe('Movies', () => {
  let app: INestApplication;
  let movieModel: Model<MovieDocument>;
  let httpServer: unknown;
  let algoliaService: AlgoliaService;
  let index: SearchIndex;

  const delayTimeMs = 5000; // time to wait for indexing

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forFeature([
          { name: MovieModel.name, schema: MovieSchema },
        ]),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    movieModel = app.get(getModelToken(MovieModel.name));
    httpServer = app.getHttpServer();
    algoliaService = app.get(AlgoliaService);
    index = algoliaService.initIndex(AlgoliaConfig.moviesIndex);
  });

  afterEach(async () => {
    await cleanup(movieModel, AlgoliaConfig.moviesIndex);
  });

  afterAll(async () => {
    await app.close();
  });

  const movieDocumentSnapshot = {
    _id: expect.any(String),
    objectID: expect.any(String),
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  };

  const movieIndexSnapshot = {
    _id: expect.any(String),
    objectID: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    _highlightResult: expect.any(Object),
  };

  it(`POST/movies -> should save a movie in a database and index`, async () => {
    const res = await request(httpServer)
      .post(`/movies`)
      .send(moviesMockData[0])
      .expect(201);
    const uuid = res.body.uuid;

    expect(uuid).toBeDefined();

    const [movie] = await movieModel.find({ _id: uuid });

    expect(movie.toObject()).toMatchSnapshot(movieDocumentSnapshot);

    await delay(delayTimeMs); // Giving some time to Algolia to finish indexing

    const indexedMovie = await index.search(movie._id);
    expect(indexedMovie.hits.length).toBe(1);
    expect(indexedMovie.hits[0].objectID).toBe(movie.objectID);
    expect(indexedMovie.hits[0]).toMatchSnapshot(movieIndexSnapshot);
  });

  it(`POST/movies -> posting with incorrect body should give validation errors`, async () => {
    const res = await request(httpServer)
      .post(`/movies`)
      .send(undefined)
      .expect(400);
    expect(res.body).toMatchSnapshot();

    const res2 = await request(httpServer)
      .post(`/movies`)
      .send({ ...moviesMockData[0], title: 1, year: 'aa' })
      .expect(400);
    expect(res2.body).toMatchSnapshot();
  });

  it(`POST/movies -> creating a movie that already exists should give an error`, async () => {
    await request(httpServer)
      .post(`/movies`)
      .send(moviesMockData[1])
      .expect(201);

    const res = await request(httpServer)
      .post(`/movies`)
      .send(moviesMockData[1])
      .expect(409);

    expect(res.body.code).toBe(MovieErrorCodes.alreadyExists);
  });

  it(`PATCH/movies -> should update a movie in a database and index`, async () => {
    const postResponse = await request(httpServer)
      .post(`/movies`)
      .send(moviesMockData[2])
      .expect(201);

    const uuid = postResponse.body.uuid;
    const newTitle = 'The Godfather 2';
    const newYear = 1988;

    await request(httpServer)
      .patch(`/movies/${uuid}`)
      .send({ title: newTitle, year: newYear })
      .expect(200);

    const [movie] = await movieModel.find({ _id: uuid });

    expect(movie.title).toBe(newTitle);
    expect(movie.year).toBe(newYear);
    expect(movie.toObject()).toMatchSnapshot(movieDocumentSnapshot);

    await delay(delayTimeMs);

    const indexedMovie = await index.search(newTitle);
    expect(indexedMovie.hits.length).toBe(1);
    expect(indexedMovie.hits[0].objectID).toBe(movie.objectID);
    expect((indexedMovie.hits[0] as Movie).title).toBe(newTitle);
    expect((indexedMovie.hits[0] as Movie).year).toBe(newYear);
    expect(indexedMovie.hits[0]).toMatchSnapshot(movieIndexSnapshot);
  });

  it(`PATCH/movies -> updating a movie with an incorrect body should give validation errors`, async () => {
    const updateResponse = await request(httpServer)
      .patch(`/movies/4a5f0e2d-a272-469b-b6fb-2af552783a75`)
      .send({ title: 1, year: 'aa' })
      .expect(400);

    expect(updateResponse.body).toMatchSnapshot();
  });

  it(`PATCH/movies -> updating deleted movie should return an error`, async () => {
    const postResponse = await request(httpServer)
      .post(`/movies`)
      .send(moviesMockData[2])
      .expect(201);

    const uuid = postResponse.body.uuid;
    await request(httpServer).delete(`/movies/${uuid}`).expect(200);

    const newTitle = 'The Godfather 2';

    const updateResponse = await request(httpServer)
      .patch(`/movies/${uuid}`)
      .send({ title: newTitle })
      .expect(404);

    expect(updateResponse.body.code).toBe(MovieErrorCodes.notFound);
  });

  it(`DELETE/movies -> should delete a movie in a database and index`, async () => {
    const postResponse = await request(httpServer)
      .post(`/movies`)
      .send(moviesMockData[3])
      .expect(201);
    const uuid = postResponse.body.uuid;

    await request(httpServer).delete(`/movies/${uuid}`).expect(200);

    const [movie] = await movieModel.find({ _id: uuid });
    expect(movie).toBeUndefined();

    await delay(delayTimeMs);

    const indexedMovie = await index.search(uuid);
    expect(indexedMovie.hits.length).toBe(0);
  });

  it(`DELETE/movies -> deleting already deleted movie should give an error`, async () => {
    const postResponse = await request(httpServer)
      .post(`/movies`)
      .send(moviesMockData[3])
      .expect(201);
    const uuid = postResponse.body.uuid;

    await request(httpServer).delete(`/movies/${uuid}`).expect(200);
    const secondDeleteResponse = await request(httpServer)
      .delete(`/movies/${uuid}`)
      .expect(404);
    expect(secondDeleteResponse.body.code).toBe(MovieErrorCodes.notFound);
  });
});
