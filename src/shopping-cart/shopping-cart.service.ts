import { Injectable } from '@nestjs/common';
import { BenefitsService } from '../benefits/benefits.service';
import { UsersService } from '../users/users.service';
import { ShoppingCart } from './shopping-cart.model';
import { InjectModel } from '@nestjs/sequelize';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectModel(ShoppingCart)
    private shoppingCartModel: typeof ShoppingCart,
    private readonly usersService: UsersService,
    private readonly benefitsService: BenefitsService,
  ) {}

  async findAll(userId: number | string): Promise<ShoppingCart[]> {
    return this.shoppingCartModel.findAll({ where: { userId } });
  }

  async add(addToCartDto: AddToCartDto) {
    const cart = new ShoppingCart();
    const user = await this.usersService.findOne({
      where: { email: addToCartDto.email },
    });
    const benefit = await this.benefitsService.findOne({
      where: { id: addToCartDto.benefitId },
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
  }

  async updateCount(
    count: number,
    benefitId: number | string,
  ): Promise<{ count: number }> {
    await this.shoppingCartModel.update({ count }, { where: { benefitId } });

    const benefit = await this.shoppingCartModel.findOne({
      where: { benefitId },
    });

    return { count: benefit.count };
  }

  async updateTotalPrice(
    total_price: number,
    benefitId: number | string,
  ): Promise<{ total_price: number }> {
    await this.shoppingCartModel.update(
      { total_price },
      { where: { benefitId } },
    );

    const benefit = await this.shoppingCartModel.findOne({
      where: { benefitId },
    });

    return { total_price: benefit.total_price };
  }

  async remove(benefitId: number | string): Promise<void> {
    const benefit = await this.shoppingCartModel.findOne({
      where: { benefitId },
    });

    return benefit.destroy();
  }

  async removeAll(userId: number | string): Promise<void> {
    await this.shoppingCartModel.destroy({ where: { userId } });
  }
}
