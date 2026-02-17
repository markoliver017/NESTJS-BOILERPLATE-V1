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
} from '@nestjs/common';
import express from 'express';
import { TheaterGroupsService } from './theater-groups.service';
import { CreateTheaterGroupDto } from './dto/create-theater-group.dto';
import { UpdateTheaterGroupDto } from './dto/update-theater-group.dto';
import * as nestjsBetterAuth from '@thallesp/nestjs-better-auth';

@Controller('theater-groups')
export class TheaterGroupsController {
  constructor(private readonly theaterGroupsService: TheaterGroupsService) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  create(
    @Body() createTheaterGroupDto: CreateTheaterGroupDto,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.theaterGroupsService.create(
      createTheaterGroupDto,
      userSession.session.userId,
    );
  }

  @Get()
  async findAll(
    @Query('q') q: string | undefined, // Changed 'query' to 'q' to match AgenciesController convention if desired, or keep as is. User's workflow says 'q'.
    // AgenciesController uses 'q'. TheaterGroupsService uses 'query'. I should pass 'q' to service as 'query'.
    @Query('_page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('_limit', new ParseIntPipe({ optional: true })) limit = 10,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { data, total } = await this.theaterGroupsService.findAll(
      q,
      page,
      limit,
    );
    res.set('X-Total-Count', total.toString());
    return data;
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.theaterGroupsService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTheaterGroupDto: UpdateTheaterGroupDto,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.theaterGroupsService.update(
      id,
      updateTheaterGroupDto,
      userSession.session.userId,
    );
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.theaterGroupsService.remove(id, userSession.session.userId);
  }
}
