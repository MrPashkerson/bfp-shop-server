import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { databaseConfig } from 'src/config/configuration';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { BenefitsModule } from 'src/benefits/benefits.module';
import { BenefitsService } from '../../src/benefits/benefits.service';
import { Benefit } from 'src/benefits/benefits.model';

const newBenefit = {
  benefit_name: 'testBenefit',
  benefit_type: 'testBenefit',
  benefit_category: 'testBenefit',
  benefit_description: 'testBenefit',
  price: 100,
  vendor_code: 'testBenefit',
  benefit_image: 'testBenefit',
  in_stock: 50,
  bestseller: false,
  new: true,
  popularity: 100,
  info: 'testBenefit',
};

describe('Benefits Service', () => {
  let app: INestApplication;
  let benefitsService: BenefitsService;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRootAsync({
          imports: [ConfigModule],
          useClass: SequelizeConfigService,
        }),
        ConfigModule.forRoot({
          load: [databaseConfig],
        }),
        BenefitsModule,
      ],
    }).compile();

    benefitsService = testModule.get<BenefitsService>(BenefitsService);
    app = testModule.createNestApplication();

    await app.init();
  });

  it('Test Create Benefit', async () => {
    const benefit = (await benefitsService.create(newBenefit)) as Benefit;

    expect(benefit).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        benefit_name: newBenefit.benefit_name,
        benefit_type: newBenefit.benefit_type,
        benefit_category: newBenefit.benefit_category,
        benefit_description: newBenefit.benefit_description,
        price: newBenefit.price,
        vendor_code: newBenefit.vendor_code,
        benefit_image: newBenefit.benefit_image,
        in_stock: newBenefit.in_stock,
        bestseller: newBenefit.bestseller,
        new: newBenefit.new,
        popularity: newBenefit.popularity,
        info: newBenefit.info,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );

    await benefitsService.delete(benefit.id);
  });

  it('Test Update Benefit', async () => {
    const benefit = (await benefitsService.create(newBenefit)) as Benefit;

    const updatedBenefit = await benefitsService.update(benefit.id, {
      id: benefit.id,
      price: 10000,
    });

    expect(updatedBenefit).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        benefit_name: newBenefit.benefit_name,
        benefit_type: newBenefit.benefit_type,
        benefit_category: newBenefit.benefit_category,
        benefit_description: newBenefit.benefit_description,
        price: 10000,
        vendor_code: newBenefit.vendor_code,
        benefit_image: newBenefit.benefit_image,
        in_stock: newBenefit.in_stock,
        bestseller: newBenefit.bestseller,
        new: newBenefit.new,
        popularity: newBenefit.popularity,
        info: newBenefit.info,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );

    await benefitsService.delete(benefit.id);
  });

  it('Test Delete Benefit', async () => {
    const benefit = (await benefitsService.create(newBenefit)) as Benefit;

    const result = await benefitsService.delete(benefit.id);

    expect(result.message).toEqual('Бенефит удалён');
  });

  it('Test Find By ID 1 (findOne Method)', async () => {
    const benefits = await benefitsService.findOne({
      where: { id: 1 },
    });

    expect(benefits.dataValues).toEqual(
      expect.objectContaining({
        id: 1,
        benefit_name: expect.any(String),
        benefit_type: expect.any(String),
        benefit_category: expect.any(String),
        benefit_description: expect.any(String),
        price: expect.any(Number),
        vendor_code: expect.any(String),
        benefit_image: expect.any(String),
        in_stock: expect.any(Number),
        bestseller: expect.any(Boolean),
        new: expect.any(Boolean),
        popularity: expect.any(Number),
        info: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });

  it('Test Search Benefit By Name', async () => {
    const benefits = await benefitsService.findOneByName('Dapifer sponte.');

    expect(benefits.dataValues).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        benefit_name: 'Dapifer sponte.',
        benefit_type: expect.any(String),
        benefit_category: expect.any(String),
        benefit_description: expect.any(String),
        price: expect.any(Number),
        vendor_code: expect.any(String),
        benefit_image: expect.any(String),
        in_stock: expect.any(Number),
        bestseller: expect.any(Boolean),
        new: expect.any(Boolean),
        popularity: expect.any(Number),
        info: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });

  it('Test Search Benefit By Specified String', async () => {
    const benefits = await benefitsService.searchByString('nos');

    benefits.forEach((item) => {
      expect(item.benefit_name.toLowerCase()).toContain('nos');
      expect(item.dataValues).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          benefit_name: expect.any(String),
          benefit_type: expect.any(String),
          benefit_category: expect.any(String),
          benefit_description: expect.any(String),
          price: expect.any(Number),
          vendor_code: expect.any(String),
          benefit_image: expect.any(String),
          in_stock: expect.any(Number),
          bestseller: expect.any(Boolean),
          new: expect.any(Boolean),
          popularity: expect.any(Number),
          info: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });
  });

  it('Test Find Bestsellers', async () => {
    const benefits = await benefitsService.bestsellers();

    benefits.rows.forEach((item) => {
      expect(item.dataValues).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          benefit_name: expect.any(String),
          benefit_type: expect.any(String),
          benefit_category: expect.any(String),
          benefit_description: expect.any(String),
          price: expect.any(Number),
          vendor_code: expect.any(String),
          benefit_image: expect.any(String),
          in_stock: expect.any(Number),
          bestseller: true,
          new: expect.any(Boolean),
          popularity: expect.any(Number),
          info: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });
  });

  it('Test Find New Benefits', async () => {
    const benefits = await benefitsService.new();

    benefits.rows.forEach((item) => {
      expect(item.dataValues).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          benefit_name: expect.any(String),
          benefit_type: expect.any(String),
          benefit_category: expect.any(String),
          benefit_description: expect.any(String),
          price: expect.any(Number),
          vendor_code: expect.any(String),
          benefit_image: expect.any(String),
          in_stock: expect.any(Number),
          bestseller: expect.any(Boolean),
          new: true,
          popularity: expect.any(Number),
          info: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });
  });

  it('Test Paginate Method', async () => {
    const benefits = await benefitsService.paginateAndFilter({
      limit: '20',
      offset: '1',
    });

    benefits.rows.forEach((item) => {
      expect(item.dataValues).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          benefit_name: expect.any(String),
          benefit_type: expect.any(String),
          benefit_category: expect.any(String),
          benefit_description: expect.any(String),
          price: expect.any(Number),
          vendor_code: expect.any(String),
          benefit_image: expect.any(String),
          in_stock: expect.any(Number),
          bestseller: expect.any(Boolean),
          new: expect.any(Boolean),
          popularity: expect.any(Number),
          info: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });

    expect(benefits.count).toEqual(expect.any(Number));
  });
});
