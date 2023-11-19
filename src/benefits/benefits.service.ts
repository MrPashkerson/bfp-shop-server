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

    if (query.priceFrom && query.priceTo) {
      filter.price = {
        [Op.between]: [+query.priceFrom, +query.priceTo],
      };
    }

    if (query.benefit) {
      filter.benefit_category = JSON.parse(decodeURIComponent(query.benefit));
    }

    if (query.benefit) {
      filter.benefit_type = JSON.parse(decodeURIComponent(query.benefit));
    }

    if (query.benefit) {
      filter.in_stock = JSON.parse(decodeURIComponent(query.benefit));
    }

    return this.benefitModel.findAndCountAll({
      limit,
      offset,
      where: filter,
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
