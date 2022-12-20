import { Prop } from '@nestjs/mongoose';

export abstract class IndexableModel {
  @Prop({ unique: true, sparse: true, index: true })
  objectID: string;

  @Prop({ default: false })
  _indexed: boolean;

  @Prop({ default: false })
  _deleted: boolean;
}
