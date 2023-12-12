import { IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: '123', description: 'ID пользователя' })
  @IsNotEmpty()
  readonly id: string;

  @ApiProperty({ example: 'Pavel', required: false })
  @IsOptional()
  readonly name?: string;

  @ApiProperty({ example: 'Homan', required: false })
  @IsOptional()
  readonly surname?: string;

  @ApiProperty({ example: '2023-09-11T21:53:58.386Z', required: false })
  @IsOptional()
  readonly hireDate?: Date;

  @ApiProperty({ example: 'example@email.com', required: false })
  @IsOptional()
  readonly email?: string;

  @ApiProperty({ example: 'password123', required: false })
  @IsOptional()
  readonly password?: string;

  @ApiProperty({ example: 'user', required: false })
  @IsOptional()
  readonly role?: string;
}
