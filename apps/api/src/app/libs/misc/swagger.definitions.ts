import { ApiQueryOptions } from '@nestjs/swagger';

export const swagger = {
  uuid: {
    name: 'uuid',
    type: String,
    required: true,
    example: '2cdc8ab1-6d50-49cc-ba14-54e4ac7ec231',
  } as ApiQueryOptions,
};
