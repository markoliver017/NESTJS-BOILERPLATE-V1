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
import { ProductionCompaniesService } from './production-companies.service';
import { CreateProductionCompanyDto } from './dto/create-production-company.dto';
import { UpdateProductionCompanyDto } from './dto/update-production-company.dto';
import * as nestjsBetterAuth from '@thallesp/nestjs-better-auth';
import { Roles, RolesGuard } from '../common';

@Controller('production-companies')
@UseGuards(RolesGuard)
export class ProductionCompaniesController {
  constructor(
    private readonly productionCompaniesService: ProductionCompaniesService,
  ) {}

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
    @Body() createDto: CreateProductionCompanyDto,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.productionCompaniesService.create(
      createDto,
      userSession.session.userId,
    );
  }

  @Get()
  @Roles('system_admin', 'agency_admin', 'production_viewer')
  async findAll(
    @Query('q') q: string | undefined,
    @Query('_page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('_limit', new ParseIntPipe({ optional: true })) limit = 10,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { data, total } = await this.productionCompaniesService.findAll(
      q,
      page,
      limit,
    );
    res.set('X-Total-Count', total.toString());
    return data;
  }

  @Get(':id')
  @Roles('system_admin', 'agency_admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productionCompaniesService.findOne(id);
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
    @Body() updateDto: UpdateProductionCompanyDto,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.productionCompaniesService.update(
      id,
      updateDto,
      userSession.session.userId,
    );
  }

  @Delete(':id')
  @Roles('system_admin')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.productionCompaniesService.remove(
      id,
      userSession.session.userId,
    );
  }
}
