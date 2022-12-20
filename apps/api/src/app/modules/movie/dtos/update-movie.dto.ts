import { CreateMovieDto } from './create-movie.dto';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateMovie } from '@types';

export class UpdateMovieDto extends CreateMovieDto implements UpdateMovie {
  @ApiProperty({ required: false })
  @IsOptional()
  readonly title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly alternative_titles: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  readonly year: number;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly image: string;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly color: string;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly score: number;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly rating: number;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly actors: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  readonly actor_facets: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  readonly genre: string[];
}
