import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/users.model';

export class LoginUserRequest {
  @ApiProperty({ example: 'example@email.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}

export class LoginUserResponse {
  @ApiProperty({
    example: {
      userId: 1,
      email: 'example@email.com',
      name: 'Pavel',
      surname: 'Homan',
      hireDate: '2023-09-11T21:53:58.386Z',
      role: 'user',
    },
  })
  user: {
    userId: number;
    email: string;
    name: string;
    surname: string;
    hireDate: string;
    role: string;
  };
  @ApiProperty({ example: 'Logged in' })
  msg: string;
}

export class LogoutUserResponse {
  @ApiProperty({ example: 'Session has ended' })
  msg: string;
}

export class LoginCheckResponse {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'example@email.com' })
  email: string;

  @ApiProperty({ example: 'Pavel' })
  name: string;

  @ApiProperty({ example: 'Homan' })
  surname: string;

  @ApiProperty({ example: '2023-09-11T21:53:58.386Z' })
  hireDate: string;

  @ApiProperty({ example: 'user' })
  role: string;
}

export class SignupResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'example@email.com' })
  email: string;

  @ApiProperty({ example: 'Pavel' })
  name: string;

  @ApiProperty({ example: 'Homan' })
  surname: string;

  @ApiProperty({
    example: '$2b$10$BfnKaBINCk9zhSe7vmqIfuxUOX16LqfjxcRXiUDCLPoFMC70GljSm',
  })
  password: string;

  @ApiProperty({ example: '2023-09-11T21:53:58.386Z' })
  hireDate: string;

  @ApiProperty({ example: 'user' })
  role: string;

  @ApiProperty({ example: '2023-09-12T12:23:33.502Z' })
  updatedAt: string;

  @ApiProperty({ example: '2023-09-17T17:23:32.502Z' })
  createdAt: string;
}

export class PaginateResponse {
  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ type: LoginCheckResponse, isArray: true })
  rows: LoginCheckResponse;
}

export class FindOneResponse extends User {}

export interface IUserQuery {
  limit: string;
  offset: string;
}
