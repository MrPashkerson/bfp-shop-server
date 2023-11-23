import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from '../../src/config/sequelizeConfig.service';
import { databaseConfig } from '../../src/config/configuration';
import { UsersModule } from '../../src/users/users.module';
import { User } from '../../src/users/users.model';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';

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
      ],
    }).compile();

    app = testModule.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await User.destroy({ where: { email: 'example@email.com' } });
  });

  it('should create user', async () => {
    const newUser = {
      name: 'TestName',
      surname: 'TestSurname',
      hireDate: new Date('2023-09-11T21:53:58.386Z'),
      email: 'example@email.com',
      password: 'password123',
    };

    const response = await request(app.getHttpServer())
      .post('/users/signup')
      .send(newUser);

    const passwordIsValid = await bcrypt.compare(newUser.password, response.body.password);

    expect(response.body.name).toBe(newUser.name);
    expect(passwordIsValid).toBe(true);
    expect(response.body.email).toBe(newUser.email);
    expect(response.body.surname).toBe(newUser.surname);
  });
});
