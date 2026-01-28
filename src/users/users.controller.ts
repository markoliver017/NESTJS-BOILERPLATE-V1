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
} from '@nestjs/common';
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
  findAll(
    @nestjsBetterAuth.Session() UserSession: nestjsBetterAuth.UserSession,
  ) {
    console.log('UserSession>>>>>>>>>>>>', UserSession);
    const { session } = UserSession;
    console.log('Session>>>>>>>>>>>>', session);
    return this.usersService.findAll();
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
    @nestjsBetterAuth.Session() UserSession: nestjsBetterAuth.UserSession,
  ) {
    return this.usersService.remove(id, UserSession);
  }
}
