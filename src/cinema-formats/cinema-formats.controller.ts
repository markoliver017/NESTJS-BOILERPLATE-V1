import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { CinemaFormatsService } from './cinema-formats.service';
import { CreateCinemaFormatDto } from './dto/create-cinema-format.dto';
import { UpdateCinemaFormatDto } from './dto/update-cinema-format.dto';
import * as nestjsBetterAuth from '@thallesp/nestjs-better-auth';
import { Roles, RolesGuard } from '../common';

@Controller('cinema-formats')
@UseGuards(RolesGuard)
export class CinemaFormatsController {
  constructor(private readonly cinemaFormatsService: CinemaFormatsService) {}

  @Post()
  @Roles('system_admin')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  create(
    @Body() createCinemaFormatDto: CreateCinemaFormatDto,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.cinemaFormatsService.create(
      createCinemaFormatDto,
      userSession.session.userId,
    );
  }

  @Get()
  @Roles('system_admin', 'agency_admin')
  async findAll(
    @Query('q') q?: string,
    @Query('_page') page?: string,
    @Query('_limit') limit?: string,
    @Res({ passthrough: true }) res?: Response,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const result = await this.cinemaFormatsService.findAll(
      q,
      pageNum,
      limitNum,
    );

    if (res) {
      res.setHeader('X-Total-Count', result.total.toString());
    }

    return result.data;
  }

  @Get(':id')
  @Roles('system_admin', 'agency_admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cinemaFormatsService.findOne(id);
  }

  @Patch(':id')
  @Roles('system_admin')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCinemaFormatDto: UpdateCinemaFormatDto,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.cinemaFormatsService.update(
      id,
      updateCinemaFormatDto,
      userSession.session.userId,
    );
  }

  @Delete(':id')
  @Roles('system_admin')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.cinemaFormatsService.remove(id, userSession.session.userId);
  }
}
