import { CreateMovie } from '@types';
import {
  IsString,
  MaxLength,
  MinLength,
  IsArray,
  IsPositive,
  Min,
  Max,
  IsInt,
  IsUrl,
  IsHexColor,
  Matches,
} from 'class-validator';
import { Trim, Escape } from 'class-sanitizer';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateMovieDto implements CreateMovie {
  @ApiProperty({
    example: 'The Shawshank Redemption',
    description: 'Movie title',
  })
  @MaxLength(500)
  @MinLength(2)
  @IsString()
  @Trim()
  @Escape()
  readonly title: string;

  @ApiProperty({
    example: ['En verden udenfor'],
    description: 'Alternative movie titles',
  })
  @MaxLength(500, { each: true })
  @MinLength(2, { each: true })
  @IsString({ each: true })
  @Trim(undefined, { each: true })
  @Escape({ each: true })
  @IsArray()
  readonly alternative_titles: string[];

  @ApiProperty({
    example: 2019,
    description: 'Year the movie was filmed',
  })
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  @Min(1900, { message: 'movie year cannot be lower than 1900' })
  @Max(new Date().getFullYear(), {
    message: 'movie year cannot be in the future',
  })
  readonly year: number;

  @ApiProperty({
    example: 'https://image.tmdb.org/t/p/w154/5pQlc8dp5dXzWg1yM70DZrsDpOl.jpg',
    description: 'Image URL',
  })
  @MaxLength(1000)
  @MinLength(10)
  @IsUrl()
  @IsString()
  @Trim()
  readonly image: string;

  @ApiProperty({
    example: '#B2A89E',
    description: 'Color',
  })
  @IsHexColor()
  readonly color: string;

  @ApiProperty({
    example: 7.5328124999999995,
    description: 'Movie Score',
  })
  @Type(() => Number)
  @IsPositive()
  @Max(10)
  @Min(1)
  readonly score: number;

  @ApiProperty({
    example: 4,
    description: 'Movie Rating',
  })
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  @Max(5)
  @Min(1)
  readonly rating: number;

  @ApiProperty({
    example: ['Tim Robbins', 'Morgan Freeman'],
    description: 'Movie Actors',
  })
  @MaxLength(100, { each: true })
  @MinLength(2, { each: true })
  @IsString({ each: true })
  @Trim(undefined, { each: true })
  @Escape({ each: true })
  @IsArray()
  readonly actors: string[];

  @ApiProperty({
    example: [
      'https://image.tmdb.org/t/p/w45/tuZCyZVVbHcpvtCgriSp5RRPwMX.jpg|Tim Robbins',
      'https://image.tmdb.org/t/p/w45/oGJQhOpT8S1M56tvSsbEBePV5O1.jpg|Morgan Freeman',
    ],
    description: 'Actor Facet Urls',
  })
  @MaxLength(1000, { each: true })
  @MinLength(2, { each: true })
  @IsString({ each: true })
  @Trim(undefined, { each: true })
  @IsArray()
  readonly actor_facets: string[];

  @ApiProperty({
    example: ['Drama', 'Crime'],
    description: 'Movie Genres',
  })
  @MaxLength(50, { each: true })
  @MinLength(2, { each: true })
  @Matches(/^[\w\-\s]+$/, {
    message: 'genre must be alphanumeric',
    each: true,
  })
  @IsString({ each: true })
  @Trim(undefined, { each: true })
  @Escape({ each: true })
  @IsArray()
  readonly genre: string[];
}
