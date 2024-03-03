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

const newUser = {
  name: 'TestName',
  surname: 'TestSurname',
  hireDate: new Date('2023-09-11T21:53:58.386Z'),
  email: 'test8@email.com',
  password: 'password123',
  role: 'user',
};

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
    await User.destroy({ where: { email: newUser.email } });
  });

  it('Test Create User', async () => {
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

  it('Test Update User', async () => {
    const user = (await usersService.create(newUser)) as User;

    const updatedUser = await usersService.update(user.id, {
      id: user.id,
      name: 'updated',
    });

    const passwordIsValid = await bcrypt.compare(
      newUser.password,
      user.password,
    );

    expect(passwordIsValid).toBe(true);

    expect(updatedUser).toEqual(
      expect.objectContaining({
        name: 'updated',
        surname: newUser.surname,
        hireDate: expect.any(Date),
        email: newUser.email,
        password: expect.any(String),
        role: newUser.role,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });

  it('Test Delete User', async () => {
    const user = (await usersService.create(newUser)) as User;

    const result = await usersService.delete(user.id);

    expect(result.message).toEqual('Пользователь удален');
  });

  it('Test Find By ID 1 (findOne Method)', async () => {
    const createdUser = (await usersService.create(newUser)) as User;
    const user = await usersService.findOne({
      where: { id: createdUser.id },
    });

    expect(user).toEqual(
      expect.objectContaining({
        id: createdUser.id,
        name: expect.any(String),
        surname: expect.any(String),
        hireDate: expect.any(Date),
        email: expect.any(String),
        password: expect.any(String),
        role: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });

  it('Test Paginate Method', async () => {
    const users = await usersService.paginate({
      limit: '20',
      offset: '1',
    });

    users.rows.forEach((item) => {
      expect(item.dataValues).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          surname: expect.any(String),
          hireDate: expect.any(Date),
          email: expect.any(String),
          password: expect.any(String),
          role: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });

    expect(users.count).toEqual(expect.any(Number));
  });
});
