import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import * as session from 'express-session';
import * as passport from 'passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { databaseConfig } from '../../src/config/configuration';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { User } from 'src/users/users.model';
import { AuthModule } from 'src/auth/auth.module';
import { BenefitsModule } from 'src/benefits/benefits.module';

const mockedUser = {
  name: 'test11',
  surname: 'test11',
  hireDate: '2023-09-11T21:53:58.386Z',
  email: 'test11@email.com',
  password: 'password123',
  role: 'admin',
};

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

describe('Benefits Controller', () => {
  let app: INestApplication;

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
        AuthModule,
      ],
    }).compile();

    app = testModule.createNestApplication();
    app.use(
      session({
        secret: 'keyword',
        resave: false,
        saveUninitialized: false,
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());

    await app.init();
  });

  beforeEach(async () => {
    const user = new User();

    const hashedPassword = await bcrypt.hash(mockedUser.password, 10);

    user.email = mockedUser.email.toLowerCase();
    user.name = mockedUser.name;
    user.surname = mockedUser.surname;
    user.password = hashedPassword;
    user.hireDate = new Date(mockedUser.hireDate);
    user.role = mockedUser.role;

    return await user.save();
  });

  afterEach(async () => {
    await User.destroy({ where: { email: mockedUser.email } });
  });

  it('Test Rest API Create Benefit', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: mockedUser.email, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .post('/benefits/create')
      .send(newBenefit)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toEqual(
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
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );

    await request(app.getHttpServer())
      .delete(`/benefits/delete/${response.body.id}`)
      .set('Cookie', login.headers['set-cookie']);
  });

  it('Test Rest API Update Benefit', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: mockedUser.email, password: mockedUser.password });

    const createBenefit = await request(app.getHttpServer())
      .post('/benefits/create')
      .send(newBenefit)
      .set('Cookie', login.headers['set-cookie']);

    const response = await request(app.getHttpServer())
      .put(`/benefits/update/${createBenefit.body.id}`)
      .send({ price: 10000 })
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        benefit_name: expect.any(String),
        benefit_type: expect.any(String),
        benefit_category: expect.any(String),
        benefit_description: expect.any(String),
        price: 10000,
        vendor_code: expect.any(String),
        benefit_image: expect.any(String),
        in_stock: expect.any(Number),
        bestseller: expect.any(Boolean),
        new: expect.any(Boolean),
        popularity: expect.any(Number),
        info: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );

    await request(app.getHttpServer())
      .delete(`/benefits/delete/${response.body.id}`)
      .set('Cookie', login.headers['set-cookie']);
  });

  it('Test Rest API Delete Benefit', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: mockedUser.email, password: mockedUser.password });

    const createBenefit = await request(app.getHttpServer())
      .post('/benefits/create')
      .send(newBenefit)
      .set('Cookie', login.headers['set-cookie']);

    const response = await request(app.getHttpServer())
      .delete(`/benefits/delete/${createBenefit.body.id}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body.message).toEqual('Бенефит удалён');
  });

  it('Test Rest API Get Benefit By ID 1', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: mockedUser.email, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .get('/benefits/find/1')
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toEqual(
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
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });

  it('Test Rest API Get Bestsellers', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: mockedUser.email, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .get('/benefits/bestsellers')
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body.rows).toEqual(
      expect.arrayContaining([
        {
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
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]),
    );
  });

  it('Test Rest API Get New Benefits', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: mockedUser.email, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .get('/benefits/new')
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body.rows).toEqual(
      expect.arrayContaining([
        {
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
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]),
    );
  });

  it('Test Rest API Search By Specified String', async () => {
    const body = { search: 'a' };

    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: mockedUser.email, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .post('/benefits/search')
      .send(body)
      .set('Cookie', login.headers['set-cookie']);

    response.body.forEach((element) => {
      expect(element.benefit_name.toLowerCase()).toContain(body.search);
    });

    expect(response.body).toEqual(
      expect.arrayContaining([
        {
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
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]),
    );
  });

  it('Test Rest API Get Benefit By Name', async () => {
    const body = { benefit_name: 'Dapifer sponte.' };

    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: mockedUser.email, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .post('/benefits/name')
      .send(body)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toEqual(
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
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });

  it('Test Rest API Get Benefits', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: mockedUser.email, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .get('/benefits?limit=20&offset=0')
      .set('Cookie', login.headers['set-cookie']);

    response.body.rows.forEach((item) => {
      expect(item).toEqual(
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
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });

    expect(response.body.count).toEqual(expect.any(Number));
  });
});
