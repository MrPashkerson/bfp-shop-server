import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ example: 'example@email.com' })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  readonly userId?: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  readonly benefitId: number;
}
