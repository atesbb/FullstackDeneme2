import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IndexableModel } from '../../libs/base-classes/indexable-model.base';

export type MovieDocument = MovieModel & Document;

@Schema({ collection: 'movies', timestamps: true })
export class MovieModel extends IndexableModel {
  @Prop({ default: uuidv4, _id: true })
  _id: string;

  @Prop({ unique: true })
  title: string;

  @Prop()
  alternative_titles: string[];

  @Prop()
  year: number;

  @Prop()
  image: string;

  @Prop()
  color: string;

  @Prop()
  score: number;

  @Prop()
  rating: number;

  @Prop()
  actors: string[];

  @Prop()
  actor_facets: string[];

  @Prop()
  genre: string[];
}

export const MovieSchema = SchemaFactory.createForClass(MovieModel);
