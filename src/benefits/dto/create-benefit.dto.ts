import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBenefitDto {
  @ApiProperty({ example: 'benefit' })
  @IsNotEmpty()
  readonly benefit_name: string;

  @ApiProperty({ example: 'type' })
  @IsNotEmpty()
  readonly benefit_type: string;

  @ApiProperty({ example: 'category' })
  @IsNotEmpty()
  readonly benefit_category: string;

  @ApiProperty({ example: 'description' })
  @IsNotEmpty()
  readonly benefit_description: string;

  @ApiProperty({ example: 20 })
  @IsNotEmpty()
  readonly price: number;

  @ApiProperty({ example: 'code' })
  @IsNotEmpty()
  readonly vendor_code: string;

  @ApiProperty({ example: 'image' })
  @IsNotEmpty()
  readonly benefit_image: string;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  readonly in_stock: number;

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
