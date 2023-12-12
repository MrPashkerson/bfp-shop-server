import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBenefitDto {
  @ApiProperty({ example: 'benefit' })
  @IsNotEmpty()
  readonly benefitName: string;

  @ApiProperty({ example: 'type' })
  @IsNotEmpty()
  readonly benefitType: string;

  @ApiProperty({ example: 'category' })
  @IsNotEmpty()
  readonly benefitCategory: string;

  @ApiProperty({ example: 'description' })
  @IsNotEmpty()
  readonly benefitDescription: string;

  @ApiProperty({ example: 20 })
  @IsNotEmpty()
  readonly price: number;

  @ApiProperty({ example: 'code' })
  @IsNotEmpty()
  readonly vendorCode: string;

  @ApiProperty({ example: 'image' })
  @IsNotEmpty()
  readonly benefitImage: string;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  readonly inStock: number;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  readonly bestseller: boolean;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  readonly new: boolean;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  readonly popularity: number;

  @ApiProperty({ example: 'info' })
  @IsNotEmpty()
  readonly info: string;
}
