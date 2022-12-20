import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponse } from '../errors/error.base';

export class ErrorResponseDto implements ErrorResponse {
  @ApiProperty({
    description: 'Error description message',
    example: 'An error occurred',
  })
  message: string;

  @ApiProperty({
    description: 'Error code',
    example: 'GENERIC.INTERNAL_SERVER_ERROR',
  })
  code: string;
}
