import { INestApplication } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from '../../src/config/sequelizeConfig.service';
import { databaseConfig } from '../../src/config/configuration';
import { AuthModule } from '../../src/auth/auth.module';
import { User } from '../../src/users/users.model';
import * as bcrypt from 'bcrypt';

const mockedUser = {
  name: 'test10',
  surname: 'test10',
  hireDate: '2023-09-11T21:53:58.386Z',
  email: 'test10@email.com',
  password: 'password123',
  role: 'user',
};

describe('Auth Service', () => {
  let app: INestApplication;
  let authService: AuthService;

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

    authService = testModule.get<AuthService>(AuthService);
    app = testModule.createNestApplication();

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

  it('Test validateUser Method', async () => {
    const user = await authService.validateUser(
      mockedUser.email,
      mockedUser.password,
    );

    expect(user.name).toBe(mockedUser.name);
    expect(user.surname).toBe(mockedUser.surname);
    expect(user.email).toBe(mockedUser.email);
  });
});
