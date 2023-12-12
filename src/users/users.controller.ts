import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Get,
  Header,
  Body,
  Query, Delete, Param, Put
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LocalAuthGuard } from '../auth/local.auth.guard';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import {
  LoginCheckResponse,
  LoginUserRequest,
  LoginUserResponse,
  LogoutUserResponse,
  PaginateResponse,
  SignupResponse
} from './types';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: SignupResponse })
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ description: 'Пользователь успешно обновлен' })
  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticatedGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiBody({ type: LoginUserRequest })
  @ApiOkResponse({ type: LoginUserResponse })
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  login(@Request() req) {
    return { user: req.user, msg: 'Logged in' };
  }

  @ApiOkResponse({ type: LoginCheckResponse })
  @Get('/login-check')
  @UseGuards(AuthenticatedGuard)
  loginCheck(@Request() req) {
    return req.user;
  }

  @ApiOkResponse({ type: PaginateResponse })
  @UseGuards(AuthenticatedGuard)
  @Get()
  paginateAndFilter(@Query() query) {
    return this.usersService.paginate(query);
  }

  @ApiOkResponse({ description: 'Пользователь удален' })
  @UseGuards(AuthenticatedGuard)
  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @ApiOkResponse({ type: LogoutUserResponse })
  @Get('/logout')
  logout(@Request() req) {
    req.session.destroy();
    return { msg: 'Session has ended' };
  }
}
