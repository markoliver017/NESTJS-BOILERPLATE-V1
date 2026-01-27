import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Request } from 'express';
import { AudittrailService } from './audittrail.service';
import { CreateAudittrailDto } from './dto/create-audittrail.dto';
import { FindAudittrailDto } from './dto/find-audittrail.dto';
import { UpdateAudittrailDto } from './dto/update-audittrail.dto';

@Controller('audittrail')
export class AudittrailController {
  constructor(private readonly audittrailService: AudittrailService) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  create(
    @Req() req: Request,
    @Body() createAudittrailDto: CreateAudittrailDto,
  ) {
    const userAgent = req.get('user-agent');

    return this.audittrailService.create({
      ...createAudittrailDto,
      ipAddress: createAudittrailDto.ipAddress ?? req.ip,
      userAgent: createAudittrailDto.userAgent ?? userAgent,
    });
  }

  @Get()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  findAll(@Query() query: FindAudittrailDto) {
    return this.audittrailService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.audittrailService.findOne(id);
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
    @Body() updateAudittrailDto: UpdateAudittrailDto,
  ) {
    return this.audittrailService.update(id, updateAudittrailDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.audittrailService.remove(id);
  }
}
