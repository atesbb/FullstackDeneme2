import {
  Body,
  ConflictException,
  Controller,
  Post,
  HttpStatus,
  Patch,
  Delete,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { UuidDto } from '../../libs/dtos/uuid.response.dto';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { MovieAlreadyExistsError, MovieNotFoundError } from './movie.errors';
import { MovieService } from './movie.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UpdateMovieDto } from './dtos/update-movie.dto';
import { ErrorResponseDto } from '../../libs/dtos/error.response.dto';
import { swagger } from '../../libs/misc/swagger.definitions';

@Controller('/movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @ApiOperation({ summary: 'Save and index a movie' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UuidDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: MovieAlreadyExistsError.message,
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
  })
  @Post()
  async create(@Body() createMovieDto: CreateMovieDto): Promise<UuidDto> {
    const result = await this.movieService.save(createMovieDto);
    return result.unwrap(
      (id) => new UuidDto(id),
      (error) => {
        if (error instanceof MovieAlreadyExistsError)
          throw new ConflictException(error.unwrap());
        throw error;
      }
    );
  }

  @ApiOperation({ summary: 'Update and index a movie' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UuidDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorResponseDto,
  })
  @ApiQuery(swagger.uuid)
  @Patch('/:uuid')
  async update(
    @Body() updateMovieDto: UpdateMovieDto,
    @Param() { uuid }: UuidDto
  ): Promise<UuidDto> {
    const result = await this.movieService.update(uuid, updateMovieDto);
    return result.unwrap(
      (id) => new UuidDto(id),
      (error) => {
        if (error instanceof MovieNotFoundError)
          throw new NotFoundException(error.unwrap());
        throw error;
      }
    );
  }

  @ApiOperation({ summary: 'Delete a movie' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ErrorResponseDto,
  })
  @ApiQuery(swagger.uuid)
  @Delete('/:uuid')
  async delete(@Param() { uuid }: UuidDto): Promise<void> {
    const result = await this.movieService.delete(uuid);
    return result.unwrap(
      () => {
        return;
      },
      (error) => {
        if (error instanceof MovieNotFoundError)
          throw new NotFoundException(error.unwrap());
        throw error;
      }
    );
  }
}
