import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request, Get
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LocalAuthGuard } from '../auth/local.auth.guard';
import { AuthenticatedGuard } from '../auth/authenticated.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Регистрация сотрудника
  // @Post('/signup')
  // @HttpCode(HttpStatus.CREATED)
  // @Header('Content-type', 'application/json')
  // createUser(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  login(@Request() req) {
    return { user: req.user, msg: 'Logged in' };
  }
}
