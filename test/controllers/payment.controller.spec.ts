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
import { PaymentModule } from 'src/payment/payment.module';

const mockedUser = {
  name: 'Pavel3',
  surname: 'Homan3',
  hireDate: '2023-09-11T21:53:58.386Z',
  email: 'test3@email.com',
  password: 'password123',
  role: 'user',
};

describe('Payment Controller', () => {
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
        PaymentModule,
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

    return user.save();
  });

  afterEach(async () => {
    await User.destroy({ where: { email: mockedUser.email } });
  });

  it('Test Rest API Make Payment', async () => {
    const body = { amount: 100 };

    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: mockedUser.email, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .post('/payment')
      .send(body)
      .set('Cookie', login.headers['set-cookie']);

    expect(+response.body.amount.value).toEqual(body.amount);
  });

  it('Test Rest API Check Payment', async () => {
    const body = { amount: 100 };

    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: mockedUser.email, password: mockedUser.password });

    const payment = await request(app.getHttpServer())
      .post('/payment')
      .send(body)
      .set('Cookie', login.headers['set-cookie']);

    const response = await request(app.getHttpServer())
      .post('/payment/info')
      .send({ paymentId: payment.body.id })
      .set('Cookie', login.headers['set-cookie']);

    expect(+response.body.amount.value).toEqual(body.amount);
  });
});
