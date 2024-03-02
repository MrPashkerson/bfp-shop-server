import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { databaseConfig } from 'src/config/configuration';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { User } from 'src/users/users.model';
import { BenefitsModule } from 'src/benefits/benefits.module';
import { BenefitsService } from 'src/benefits/benefits.service';
import { UsersService } from 'src/users/users.service';
import { ShoppingCart } from 'src/shopping-cart/shopping-cart.model';
import { ShoppingCartModule } from 'src/shopping-cart/shopping-cart.module';
import { ShoppingCartService } from 'src/shopping-cart/shopping-cart.service';

const mockedUser = {
  name: 'Pavel7',
  surname: 'Homan7',
  hireDate: '2023-09-11T21:53:58.386Z',
  email: 'test7@email.com',
  password: 'password123',
  role: 'user',
};

describe('Shopping Cart Service', () => {
  let app: INestApplication;
  let benefitsService: BenefitsService;
  let usersService: UsersService;
  let shoppingCartService: ShoppingCartService;

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
      ],
    }).compile();

    benefitsService = testModule.get<BenefitsService>(BenefitsService);
    usersService = testModule.get<UsersService>(UsersService);
    shoppingCartService =
      testModule.get<ShoppingCartService>(ShoppingCartService);

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

  beforeEach(async () => {
    const cart = new ShoppingCart();
    const user = await usersService.findOne({
      where: { email: mockedUser.email },
    });
    const benefit = await benefitsService.findOne({
      where: { id: 1 },
    });

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

  it('Test Get All Cart Items', async () => {
    const user = await usersService.findOne({
      where: { email: mockedUser.email },
    });

    await shoppingCartService.add({
      email: mockedUser.email,
      benefitId: 1,
    });

    await shoppingCartService.add({
      email: mockedUser.email,
      benefitId: 2,
    });

    const cart = await shoppingCartService.findAll(user.id);

    expect(cart.length).toBeGreaterThanOrEqual(2);

    cart.forEach((item) =>
      expect(item.dataValues).toEqual(
        expect.objectContaining({
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
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      ),
    );
  });

  it('Test Add Cart Items', async () => {
    await shoppingCartService.add({
      email: mockedUser.email,
      benefitId: 1,
    });

    const user = await usersService.findOne({
      where: { email: mockedUser.email },
    });

    const cart = await shoppingCartService.findAll(user.id);

    expect(cart.find((item) => item.benefitId === 1)).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        benefit_name: expect.any(String),
        price: expect.any(Number),
        image: expect.any(String),
        in_stock: expect.any(Number),
        benefit_type: expect.any(String),
        benefit_category: expect.any(String),
        userId: user.id,
        benefitId: 1,
        count: expect.any(Number),
        total_price: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });

  it('Test Update Count', async () => {
    const result = await shoppingCartService.updateCount(2, 1);

    expect(result).toEqual({ count: 2 });
  });

  it('Test Update Total Price', async () => {
    const benefit = await benefitsService.findOne({
      where: { id: 1 },
    });
    const result = await shoppingCartService.updateTotalPrice(
      benefit.price * 3,
      1,
    );

    expect(result).toEqual({ total_price: benefit.price * 3 });
  });

  it('Test Delete Cart Item', async () => {
    const user = await usersService.findOne({
      where: { email: mockedUser.email },
    });

    await shoppingCartService.removeAll(user.id);

    await shoppingCartService.add({
      email: mockedUser.email,
      benefitId: 1,
    });

    await shoppingCartService.remove(1);

    const cart = await shoppingCartService.findAll(user.id);

    expect(cart.find((item) => item.benefitId === 1)).toBeUndefined();
  });

  it('Test Delete All Cart Items', async () => {
    await shoppingCartService.add({
      email: mockedUser.email,
      benefitId: 1,
    });

    await shoppingCartService.add({
      email: mockedUser.email,
      benefitId: 2,
    });

    const user = await usersService.findOne({
      where: { email: mockedUser.email },
    });

    await shoppingCartService.removeAll(user.id);

    const cart = await shoppingCartService.findAll(user.id);

    expect(cart).toStrictEqual([]);
  });
});
