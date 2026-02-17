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
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as nestjsBetterAuth from '@thallesp/nestjs-better-auth';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(
    @Query('q') q?: string,
    @Query('_page') page?: string,
    @Query('_limit') limit?: string,
    @Res({ passthrough: true }) res?: Response,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    const result = await this.usersService.findAll(q, pageNum, limitNum);

    // Set X-Total-Count header for pagination
    if (res) {
      res.setHeader('X-Total-Count', result.total.toString());
    }

    return result.data;
  }

  @Get('admin')
  @nestjsBetterAuth.Roles(['admin']) // Only authenticated users with the 'admin' role can access this route. Uses the access control plugin from better-auth.
  adminRoute() {
    return 'Only admins can see this';
  }

  @Get('email/:email')
  @nestjsBetterAuth.AllowAnonymous()
  findOneByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
  ) {
    return this.usersService.remove(id, userSession);
  }
}
