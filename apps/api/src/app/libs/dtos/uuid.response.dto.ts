import { ApiProperty } from '@nestjs/swagger';
import { Uuid } from '@types';
import { IsUUID } from 'class-validator';

export class UuidDto implements Uuid {
  @ApiProperty({
    example: '2cdc8ab1-6d50-49cc-ba14-54e4ac7ec231',
  })
  @IsUUID()
  readonly uuid: string;

  constructor(uuid: string) {
    this.uuid = uuid;
  }
}
