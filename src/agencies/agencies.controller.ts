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
import { AgenciesService } from './agencies.service';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import * as nestjsBetterAuth from '@thallesp/nestjs-better-auth';
import { Roles, RolesGuard } from '../common';

@Controller('agencies')
@UseGuards(RolesGuard)
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) {}

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
    @Body() createAgencyDto: CreateAgencyDto,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.agenciesService.create(
      createAgencyDto,
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
    const { data, total } = await this.agenciesService.findAll(q, page, limit);
    res.set('X-Total-Count', total.toString());
    return data;
  }

  @Get(':id')
  @Roles('system_admin', 'agency_admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.agenciesService.findOne(id);
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
    @Body() updateAgencyDto: UpdateAgencyDto,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.agenciesService.update(
      id,
      updateAgencyDto,
      userSession.session.userId,
    );
  }

  @Delete(':id')
  @Roles('system_admin')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.agenciesService.remove(id, userSession.session.userId);
  }
}
