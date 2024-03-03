import { IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBenefitDto {
  @ApiProperty({ example: 123, description: 'ID бенефита' })
  @IsNotEmpty()
  readonly id: number;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  readonly benefit_name?: string;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  readonly benefit_type?: string;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  readonly benefit_category?: string;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  readonly benefit_description?: string;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  readonly price?: number;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  readonly vendor_code?: string;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  readonly benefit_image?: string;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  readonly in_stock?: number;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  readonly bestseller?: boolean;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  readonly new?: boolean;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  readonly popularity?: number;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  readonly info?: string;
}
