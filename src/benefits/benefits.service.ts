import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Benefit } from './benefits.model';
import { Op } from 'sequelize';
import { IBenefitFilter, IBenefitQuery } from './types';
import { CreateBenefitDto } from 'src/benefits/dto/create-benefit.dto';
import { UpdateBenefitDto } from 'src/benefits/dto/update-benefit.dto';

@Injectable()
export class BenefitsService {
  constructor(
    @InjectModel(Benefit)
    private benefitModel: typeof Benefit,
  ) {}

  async create(
    createBenefitDto: CreateBenefitDto,
  ): Promise<Benefit | { warningMessage: string }> {
    const benefit = new Benefit();
    console.log(createBenefitDto);

    const existingByBenefitName = await this.findOne({
      where: { benefit_name: createBenefitDto.benefit_name },
    });

    const existingByVendorCode = await this.findOne({
      where: { vendor_code: createBenefitDto.vendor_code },
    });

    if (existingByBenefitName) {
      return {
        warningMessage: 'Бенефит с таким названием уже существует',
      };
    }

    if (existingByVendorCode) {
      return {
        warningMessage: 'Бенефит с таким артикулом уже существует',
      };
    }

    benefit.benefit_name = createBenefitDto.benefit_name;
    benefit.benefit_type = createBenefitDto.benefit_type;
    benefit.benefit_category = createBenefitDto.benefit_category;
    benefit.benefit_description = createBenefitDto.benefit_description;
    benefit.price = createBenefitDto.price;
    benefit.vendor_code = createBenefitDto.vendor_code;
    benefit.benefit_image = createBenefitDto.benefit_image;
    benefit.in_stock = createBenefitDto.in_stock;
    benefit.bestseller = createBenefitDto.bestseller;
    benefit.new = createBenefitDto.new;
    benefit.popularity = createBenefitDto.popularity;
    benefit.info = createBenefitDto.info;

    return benefit.save();
  }

  async update(
    id: number,
    updateBenefitDto: UpdateBenefitDto,
  ): Promise<Benefit | { warningMessage: string }> {
    console.log(updateBenefitDto);
    const benefit = await this.findOne({ where: { id: id } });
    if (!benefit) {
      return { warningMessage: 'Бенефит не найден' };
    }

    benefit.benefit_name =
      updateBenefitDto.benefit_name ?? benefit.benefit_name;
    benefit.benefit_type =
      updateBenefitDto.benefit_type ?? benefit.benefit_type;
    benefit.benefit_category =
      updateBenefitDto.benefit_category ?? benefit.benefit_category;
    benefit.benefit_description =
      updateBenefitDto.benefit_description ?? benefit.benefit_description;
    benefit.price = updateBenefitDto.price ?? benefit.price;
    benefit.vendor_code = updateBenefitDto.vendor_code ?? benefit.vendor_code;
    benefit.benefit_image =
      updateBenefitDto.benefit_image ?? benefit.benefit_image;
    benefit.in_stock = updateBenefitDto.in_stock ?? benefit.in_stock;
    benefit.bestseller = updateBenefitDto.bestseller ?? benefit.bestseller;
    benefit.new = updateBenefitDto.new ?? benefit.new;
    benefit.popularity = updateBenefitDto.popularity ?? benefit.popularity;
    benefit.info = updateBenefitDto.info ?? benefit.info;

    await benefit.save();
    return benefit;
  }

  async delete(benefitId: string): Promise<{ message: string }> {
    const benefit = await this.findOne({ where: { id: benefitId } });
    if (!benefit) {
      return { message: 'Бенефит не найден' };
    }

    await benefit.destroy();
    return { message: 'Бенефит удалён' };
  }

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

  async findOne(filter: {
    where: {
      id?: number | string;
      benefit_name?: string;
      vendor_code?: string;
    };
  }): Promise<Benefit> {
    return this.benefitModel.findOne({ ...filter });
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
