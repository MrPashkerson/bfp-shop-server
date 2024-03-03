import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { databaseConfig } from 'src/config/configuration';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/users.model';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import * as session from 'express-session';
import * as passport from 'passport';
import { AuthModule } from 'src/auth/auth.module';

const newUser = {
  name: 'TestName',
  surname: 'TestSurname',
  hireDate: new Date('2023-09-11T21:53:58.386Z'),
  email: 'test8@email.com',
  password: 'password123',
  role: 'user',
};

describe('Users Controller', () => {
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
        UsersModule,
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

  afterEach(async () => {
    await User.destroy({ where: { email: newUser.email } });
  });

  it('Test Rest API Create User', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/signup')
      .send(newUser);

    const passwordIsValid = await bcrypt.compare(
      newUser.password,
      response.body.password,
    );

    expect(response.body.name).toBe(newUser.name);
    expect(passwordIsValid).toBe(true);
    expect(response.body.email).toBe(newUser.email);
    expect(response.body.surname).toBe(newUser.surname);
  });

  it('Test Rest API Update User', async () => {
    await request(app.getHttpServer()).post('/users/signup').send(newUser);

    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: newUser.email, password: newUser.password });

    const response = await request(app.getHttpServer())
      .put(`/users/update/${login.body.user.userId}`)
      .send({ name: 'updated' })
      .set('Cookie', login.headers['set-cookie']);

    const passwordIsValid = await bcrypt.compare(
      newUser.password,
      response.body.password,
    );

    expect(response.body.name).toBe('updated');
    expect(passwordIsValid).toBe(true);
    expect(response.body.email).toBe(newUser.email);
    expect(response.body.surname).toBe(newUser.surname);
  });

  it('Test Rest API Delete User', async () => {
    await request(app.getHttpServer()).post('/users/signup').send(newUser);

    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: newUser.email, password: newUser.password });

    const response = await request(app.getHttpServer())
      .delete(`/users/delete/${login.body.user.userId}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body.message).toEqual('Пользователь удален');
  });

  it('Test Rest API Get User By ID 1', async () => {
    await request(app.getHttpServer()).post('/users/signup').send(newUser);

    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: newUser.email, password: newUser.password });

    const response = await request(app.getHttpServer())
      .get(`/users/find/${login.body.user.userId}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body.id).toEqual(login.body.user.userId);
  });

  it('Test Rest API Get Users', async () => {
    await request(app.getHttpServer()).post('/users/signup').send(newUser);

    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: newUser.email, password: newUser.password });

    const response = await request(app.getHttpServer())
      .get('/users?limit=20&offset=0')
      .set('Cookie', login.headers['set-cookie']);

    response.body.rows.forEach((item) => {
      expect(item).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          surname: expect.any(String),
          hireDate: expect.any(String),
          email: expect.any(String),
          password: expect.any(String),
          role: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });

    expect(response.body.count).toEqual(expect.any(Number));
  });
});
