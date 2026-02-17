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
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { CinemasService } from './cinemas.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import * as nestjsBetterAuth from '@thallesp/nestjs-better-auth';

import { Roles, RolesGuard } from '../common';

@Controller('cinemas')
@UseGuards(RolesGuard)
export class CinemasController {
  constructor(private readonly cinemasService: CinemasService) {}

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
    @Body() createCinemaDto: CreateCinemaDto,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.cinemasService.create(
      createCinemaDto,
      userSession.session.userId,
    );
  }

  @Get()
  @Roles('system_admin', 'agency_admin')
  async findAll(
    @Query('q') q?: string,
    @Query('_page') page?: string,
    @Query('_limit') limit?: string,
    @Query('theater_id') theaterId?: string,
    @Res({ passthrough: true }) res?: Response,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const theaterIdNum = theaterId ? parseInt(theaterId, 10) : undefined;

    const result = await this.cinemasService.findAll(
      q,
      pageNum,
      limitNum,
      theaterIdNum,
    );

    // Set X-Total-Count header for pagination
    if (res) {
      res.setHeader('X-Total-Count', result.total.toString());
    }

    return result.data;
  }

  @Get(':id')
  @Roles('system_admin', 'agency_admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cinemasService.findOne(id);
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
    @Body() updateCinemaDto: UpdateCinemaDto,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.cinemasService.update(
      id,
      updateCinemaDto,
      userSession.session.userId,
    );
  }

  @Delete(':id')
  @Roles('system_admin', 'agency_admin')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.cinemasService.remove(id, userSession.session.userId);
  }
}
