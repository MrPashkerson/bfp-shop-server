import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Pavel' })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'Homan' })
  @IsNotEmpty()
  readonly surname: string;

  @ApiProperty({ example: '2023-09-11T21:53:58.386Z' })
  @IsNotEmpty()
  readonly hireDate: Date;

  @ApiProperty({ example: 'example@email.com' })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  readonly password: string;
}
