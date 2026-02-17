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
import { TheatersService } from './theaters.service';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';
import * as nestjsBetterAuth from '@thallesp/nestjs-better-auth';
import { Roles, RolesGuard } from '../common';

@Controller('theaters')
@UseGuards(RolesGuard)
export class TheatersController {
  constructor(private readonly theatersService: TheatersService) {}

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
    @Body() createTheaterDto: CreateTheaterDto,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.theatersService.create(
      createTheaterDto,
      userSession.session.userId,
    );
  }

  @Get()
  @Roles('system_admin', 'agency_admin')
  async findAll(
    @Query('q') q: string | undefined,
    @Query('_page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('_limit', new ParseIntPipe({ optional: true })) limit = 10,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { data, total } = await this.theatersService.findAll(q, page, limit);
    res.set('X-Total-Count', total.toString());
    return data;
  }

  @Get(':id')
  @Roles('system_admin', 'agency_admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.theatersService.findOne(id);
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
    @Body() updateTheaterDto: UpdateTheaterDto,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.theatersService.update(
      id,
      updateTheaterDto,
      userSession.session.userId,
    );
  }

  @Delete(':id')
  @Roles('system_admin')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.theatersService.remove(id, userSession.session.userId);
  }
}
