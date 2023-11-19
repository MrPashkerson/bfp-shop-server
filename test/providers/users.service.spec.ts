import * as bcrypt from 'bcrypt';
import { INestApplication } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { databaseConfig } from 'src/config/configuration';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/users.model';

describe('Users Service', () => {
  let app: INestApplication;
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
        UsersModule,
      ],
    }).compile();

    usersService = testModule.get<UsersService>(UsersService);
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
      role: 'user',
    };

    const user = (await usersService.create(newUser)) as User;

    const passwordIsValid = await bcrypt.compare(
      newUser.password,
      user.password,
    );

    expect(user.name).toBe(newUser.name);
    expect(passwordIsValid).toBe(true);
    expect(user.email).toBe(newUser.email);
    expect(user.surname).toBe(newUser.surname);
    expect(user.hireDate).toBe(newUser.hireDate);
    expect(user.role).toBe(newUser.role);
  });
});
