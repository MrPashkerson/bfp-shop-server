import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Benefit } from './benefits.model';
import { Op } from 'sequelize';
import { IBenefitFilter, IBenefitQuery } from './types';

@Injectable()
export class BenefitsService {
  constructor(
    @InjectModel(Benefit)
    private benefitModel: typeof Benefit,
  ) {}

  async paginateAndFilter(
    query: IBenefitQuery,
  ): Promise<{ count: number; rows: Benefit[] }> {
    const limit = +query.limit;
    const offset = +query.offset * 20;
    const filter = {} as Partial<IBenefitFilter>;
    console.log(query);
    if (query.priceFrom && query.priceTo) {
      filter.price = {
        [Op.between]: [+query.priceFrom, +query.priceTo],
      };
    }

    let order = [];
    if (query.first) {
      const sortField = query.first.split('_')[0];
      const sortOrder = query.first.split('_')[1];
      order = [[sortField, sortOrder]];
    }

    if (
      query.benefit_category &&
      decodeURIComponent(query.benefit_category) !== '[]'
    ) {
      filter.benefit_category = JSON.parse(
        decodeURIComponent(query.benefit_category),
      );
    }

    if (query.benefit_type && decodeURIComponent(query.benefit_type) !== '[]') {
      filter.benefit_type = JSON.parse(decodeURIComponent(query.benefit_type));
    }

    if (query.benefit_stock) {
      filter.in_stock = JSON.parse(decodeURIComponent(query.benefit_stock));
    }

    return this.benefitModel.findAndCountAll({
      limit,
      offset,
      where: filter,
      order,
    });
  }

  async bestsellers(): Promise<{ count: number; rows: Benefit[] }> {
    return this.benefitModel.findAndCountAll({
      where: { bestseller: true },
    });
  }

  async new(): Promise<{ count: number; rows: Benefit[] }> {
    return this.benefitModel.findAndCountAll({
      where: { new: true },
    });
  }

  async findOne(id: number | string): Promise<Benefit> {
    return this.benefitModel.findOne({
      where: { id },
    });
  }

  async findOneByName(benefit_name: string): Promise<Benefit> {
    return this.benefitModel.findOne({
      where: { benefit_name },
    });
  }

  async searchByString(search: string): Promise<Benefit[]> {
    return this.benefitModel.findAll({
      where: {
        benefit_name: {
          [Op.like]: `%${search}%`,
        },
      },
    });
  }
}
