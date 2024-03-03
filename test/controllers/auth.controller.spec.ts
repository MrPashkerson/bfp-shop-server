import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import * as session from 'express-session';
import * as passport from 'passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { databaseConfig } from '../../src/config/configuration';
import { SequelizeConfigService } from '../../src/config/sequelizeConfig.service';
import { User } from '../../src/users/users.model';
import { AuthModule } from '../../src/auth/auth.module';

const mockedUser = {
  name: 'test',
  surname: 'test',
  hireDate: '2023-09-11T21:53:58.386Z',
  email: 'test@email.com',
  password: 'password123',
  role: 'user',
};

describe('Auth Controller', () => {
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

  it('Test Rest API User login', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: mockedUser.email, password: mockedUser.password });

    expect(response.body.user.email).toBe(mockedUser.email);
    expect(response.body.msg).toBe('Logged in');
  });

  it('Test Rest API User login-check', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: mockedUser.email, password: mockedUser.password });

    const loginCheck = await request(app.getHttpServer())
      .get('/users/login-check')
      .set('Cookie', login.headers['set-cookie']);

    expect(loginCheck.body.email).toBe(mockedUser.email);
  });

  it('Test Rest API User logout', async () => {
    const response = await request(app.getHttpServer()).get('/users/logout');

    expect(response.body.msg).toBe('Session has ended');
  });
});
