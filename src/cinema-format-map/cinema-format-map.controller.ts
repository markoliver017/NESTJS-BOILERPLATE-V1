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
import express from 'express';
import { CinemaFormatMapService } from './cinema-format-map.service';
import { CreateCinemaFormatMapDto } from './dto/create-cinema-format-map.dto';
import { UpdateCinemaFormatMapDto } from './dto/update-cinema-format-map.dto';
import * as nestjsBetterAuth from '@thallesp/nestjs-better-auth';
import { Roles, RolesGuard } from '../common';

@Controller('cinema-format-map')
@UseGuards(RolesGuard)
export class CinemaFormatMapController {
  constructor(
    private readonly cinemaFormatMapService: CinemaFormatMapService,
  ) {}

  @Post()
  @Roles('system_admin', 'agency_admin')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  create(
    @Body() createCinemaFormatMapDto: CreateCinemaFormatMapDto,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.cinemaFormatMapService.create(
      createCinemaFormatMapDto,
      userSession.session.userId,
    );
  }

  @Get()
  @Roles('system_admin', 'agency_admin')
  async findAll(
    @Query('cinema_id', ParseIntPipe) cinemaId: number,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { data, total } = await this.cinemaFormatMapService.findAll(cinemaId);
    res.set('X-Total-Count', total.toString());
    return data;
  }

  @Get(':id')
  @Roles('system_admin', 'agency_admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cinemaFormatMapService.findOne(id);
  }

  @Patch(':id')
  @Roles('system_admin', 'agency_admin')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCinemaFormatMapDto: UpdateCinemaFormatMapDto,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.cinemaFormatMapService.update(
      id,
      updateCinemaFormatMapDto,
      userSession.session.userId,
    );
  }

  @Delete(':id')
  @Roles('system_admin', 'agency_admin')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.cinemaFormatMapService.remove(id, userSession.session.userId);
  }
}
