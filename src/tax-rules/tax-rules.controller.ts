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
import { TaxRulesService } from './tax-rules.service';
import { CreateTaxRuleDto } from './dto/create-tax-rule.dto';
import { UpdateTaxRuleDto } from './dto/update-tax-rule.dto';
import * as nestjsBetterAuth from '@thallesp/nestjs-better-auth';
import { Roles, RolesGuard } from '../common';

@Controller('tax-rules')
@UseGuards(RolesGuard)
export class TaxRulesController {
  constructor(private readonly taxRulesService: TaxRulesService) {}

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
    @Body() createTaxRuleDto: CreateTaxRuleDto,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.taxRulesService.create(
      createTaxRuleDto,
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
    const { data, total } = await this.taxRulesService.findAll(q, page, limit);
    res.set('X-Total-Count', total.toString());
    return data;
  }

  @Get(':id')
  @Roles('system_admin', 'agency_admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.taxRulesService.findOne(id);
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
    @Body() updateTaxRuleDto: UpdateTaxRuleDto,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.taxRulesService.update(
      id,
      updateTaxRuleDto,
      userSession.session.userId,
    );
  }

  @Delete(':id')
  @Roles('system_admin')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.taxRulesService.remove(id, userSession.session.userId);
  }
}
