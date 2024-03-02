import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import * as session from 'express-session';
import * as passport from 'passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { databaseConfig } from 'src/config/configuration';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { User } from 'src/users/users.model';
import { AuthModule } from 'src/auth/auth.module';
import { BenefitsModule } from 'src/benefits/benefits.module';
import { BenefitsService } from 'src/benefits/benefits.service';
import { UsersService } from 'src/users/users.service';
import { ShoppingCart } from 'src/shopping-cart/shopping-cart.model';
import { ShoppingCartModule } from 'src/shopping-cart/shopping-cart.module';

const mockedUser = {
  name: 'Pavel4',
  surname: 'Homan4',
  hireDate: '2023-09-11T21:53:58.386Z',
  email: 'test4@email.com',
  password: 'password123',
  role: 'user',
};

describe('Shopping Cart Controller', () => {
  let app: INestApplication;
  let benefitsService: BenefitsService;
  let usersService: UsersService;

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
        ShoppingCartModule,
        BenefitsModule,
        AuthModule,
      ],
    }).compile();

    benefitsService = testModule.get<BenefitsService>(BenefitsService);
    usersService = testModule.get<UsersService>(UsersService);

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

    return user.save();
  });

  beforeEach(async () => {
    const cart = new ShoppingCart();
    const user = await usersService.findOne({
      where: { email: mockedUser.email },
    });
    const benefit = await benefitsService.findOne({ where: { id: 1 } });

    cart.userId = user.id;
    cart.benefitId = benefit.id;
    cart.benefit_name = benefit.benefit_name;
    cart.benefit_category = benefit.benefit_category;
    cart.benefit_type = benefit.benefit_type;
    cart.price = benefit.price;
    cart.in_stock = benefit.in_stock;
    cart.image = benefit.benefit_image;
    cart.total_price = benefit.price;

    return cart.save();
  });

  afterEach(async () => {
    const user = await usersService.findOne({
      where: { email: mockedUser.email },
    });
    await ShoppingCart.destroy({ where: { userId: user.id } });
    await User.destroy({ where: { email: mockedUser.email } });
  });

  it('Test Rest API Add Cart Item', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: mockedUser.email, password: mockedUser.password });

    const user = await usersService.findOne({
      where: { email: mockedUser.email },
    });

    await request(app.getHttpServer())
      .post('/shopping-cart/add')
      .send({ email: mockedUser.email, benefitId: 1 })
      .set('Cookie', login.headers['set-cookie']);

    const response = await request(app.getHttpServer())
      .get(`/shopping-cart/${user.id}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body.find((item) => item.benefitId === 1)).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        benefitId: 1,
        benefit_name: expect.any(String),
        price: expect.any(Number),
        image: expect.any(String),
        in_stock: expect.any(Number),
        benefit_type: expect.any(String),
        benefit_category: expect.any(String),
        userId: user.id,
        count: expect.any(Number),
        total_price: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });

  it('Test Rest API Get All Cart Items', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: mockedUser.email, password: mockedUser.password });

    await request(app.getHttpServer())
      .post('/shopping-cart/add')
      .send({ email: mockedUser.email, benefitId: 3 })
      .set('Cookie', login.headers['set-cookie']);

    await request(app.getHttpServer())
      .post('/shopping-cart/add')
      .send({ email: mockedUser.email, benefitId: 2 })
      .set('Cookie', login.headers['set-cookie']);

    const user = await usersService.findOne({
      where: { email: mockedUser.email },
    });

    const response = await request(app.getHttpServer())
      .get(`/shopping-cart/${user.id}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body.length).toBeGreaterThanOrEqual(2);

    expect(response.body).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(Number),
          benefit_name: expect.any(String),
          price: expect.any(Number),
          image: expect.any(String),
          in_stock: expect.any(Number),
          benefit_type: expect.any(String),
          benefit_category: expect.any(String),
          userId: user.id,
          benefitId: expect.any(Number),
          count: expect.any(Number),
          total_price: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]),
    );
  });

  it('Test Rest API Get Updated Count Of Cart Item', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: mockedUser.email, password: mockedUser.password });

    await request(app.getHttpServer())
      .post('/shopping-cart/add')
      .send({ email: mockedUser.email, benefitId: 1 })
      .set('Cookie', login.headers['set-cookie']);

    const response = await request(app.getHttpServer())
      .patch('/shopping-cart/count/1')
      .send({ count: 2 })
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toEqual({ count: 2 });
  });

  it('Test Rest API Get Updated Total Price Of Cart Item', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: mockedUser.email, password: mockedUser.password });

    const benefit = await benefitsService.findOne({ where: { id: 1 } });

    const response = await request(app.getHttpServer())
      .patch('/shopping-cart/total-price/1')
      .send({ total_price: benefit.price * 3 })
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toEqual({ total_price: benefit.price * 3 });
  });

  it('Test Rest API Delete One Cart Item', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: mockedUser.email, password: mockedUser.password });

    const user = await usersService.findOne({
      where: { email: mockedUser.email },
    });

    await request(app.getHttpServer())
      .delete(`/shopping-cart/all/${user.id}`)
      .set('Cookie', login.headers['set-cookie']);

    await request(app.getHttpServer())
      .post('/shopping-cart/add')
      .send({ email: mockedUser.email, benefitId: 1 })
      .set('Cookie', login.headers['set-cookie']);

    await request(app.getHttpServer())
      .delete('/shopping-cart/one/1')
      .set('Cookie', login.headers['set-cookie']);

    const response = await request(app.getHttpServer())
      .get(`/shopping-cart/${user.id}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body.find((item) => item.benefitId === 1)).toBeUndefined();
  });

  it('Test Rest API Delete All Cart Items', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: mockedUser.email, password: mockedUser.password });

    const user = await usersService.findOne({
      where: { email: mockedUser.email },
    });

    await request(app.getHttpServer())
      .post('/shopping-cart/add')
      .send({ email: mockedUser.email, benefitId: 1 })
      .set('Cookie', login.headers['set-cookie']);

    await request(app.getHttpServer())
      .post('/shopping-cart/add')
      .send({ email: mockedUser.email, benefitId: 2 })
      .set('Cookie', login.headers['set-cookie']);

    await request(app.getHttpServer())
      .post('/shopping-cart/add')
      .send({ email: mockedUser.email, benefitId: 4 })
      .set('Cookie', login.headers['set-cookie']);

    await request(app.getHttpServer())
      .delete(`/shopping-cart/all/${user.id}`)
      .set('Cookie', login.headers['set-cookie']);

    const response = await request(app.getHttpServer())
      .get(`/shopping-cart/${user.id}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toStrictEqual([]);
  });
});
