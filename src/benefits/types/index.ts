import { Op } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';

class Benefit {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: faker.lorem.word() })
  benefit_name: string;

  @ApiProperty({ example: faker.lorem.sentence(2) })
  benefit_category: string;

  @ApiProperty({ example: faker.lorem.sentence(2) })
  benefit_type: string;

  @ApiProperty({ example: 12345 })
  price: string;

  @ApiProperty({ example: faker.image.city() })
  benefit_image: string;

  @ApiProperty({ example: true })
  in_stock: number;

  @ApiProperty({ example: true })
  bestseller: boolean;

  @ApiProperty({ example: false })
  new: boolean;

  @ApiProperty({ example: 123 })
  popularity: number;

  @ApiProperty({ example: '2023-01-31T19:46:45.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-01-31T19:46:45.000Z' })
  updatedAt: string;
}

export class PaginateAndFilterResponse {
  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ type: Benefit, isArray: true })
  rows: Benefit;
}

export class Bestsellers extends Benefit {
  @ApiProperty({ example: true })
  bestseller: boolean;
}

export class GetBestsellersResponse extends PaginateAndFilterResponse {
  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ type: Bestsellers, isArray: true })
  rows: Bestsellers;
}

export class NewBenefits extends Benefit {
  @ApiProperty({ example: true })
  new: boolean;
}

export class GetNewResponse extends PaginateAndFilterResponse {
  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ type: NewBenefits, isArray: true })
  rows: NewBenefits;
}

export class SearchByLetterResponse extends Benefit {
  @ApiProperty({ example: 'Provident incidunt.' })
  benefit_name: string;
}

export class SearchResponse extends PaginateAndFilterResponse {
  @ApiProperty({ type: SearchByLetterResponse, isArray: true })
  rows: SearchByLetterResponse;
}

export class SearchRequest {
  @ApiProperty({ example: 'a' })
  search: string;
}

export class GetByNameResponse extends Benefit {
  @ApiProperty({ example: 'Provident incidunt.' })
  benefit_name: string;
}

export class GetByNameRequest {
  @ApiProperty({ example: 'Provident incidunt.' })
  benefit_name: string;
}

export class FindOneResponse extends Benefit {}

export class CreateBenefitResponse {
  @ApiProperty({ example: '' })
  id: string;

  @ApiProperty({ example: '' })
  benefit_name: string;

  @ApiProperty({ example: '' })
  benefit_type: string;

  @ApiProperty({ example: '' })
  benefit_category: string;

  @ApiProperty({ example: '' })
  benefit_description: string;

  @ApiProperty({ example: '' })
  price: number;

  @ApiProperty({ example: '' })
  vendor_code: string;

  @ApiProperty({ example: '' })
  benefit_image: string;

  @ApiProperty({ example: '' })
  in_stock: number;

  @ApiProperty({ example: '' })
  bestseller: boolean;

  @ApiProperty({ example: '' })
  new: boolean;

  @ApiProperty({ example: '' })
  popularity: number;

  @ApiProperty({ example: '' })
  info: string;

  @ApiProperty({ example: '2023-09-12T12:23:33.502Z' })
  updatedAt: string;

  @ApiProperty({ example: '2023-09-17T17:23:32.502Z' })
  createdAt: string;
}

export interface IBenefitQuery {
  limit: string;
  offset: string;
  priceFrom?: string | undefined;
  priceTo?: string | undefined;
  benefit_category?: string | undefined;
  benefit_type?: string | undefined;
  benefit_stock?: string | undefined;
  first?: string | undefined;
}

export interface IBenefitFilter {
  price: {
    [Op.between]: number[];
  };
  benefit_category: string | undefined;
  benefit_type: string | undefined;
  in_stock: number | undefined;
}
