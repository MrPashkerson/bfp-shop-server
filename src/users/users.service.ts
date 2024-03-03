import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { IUserQuery } from 'src/users/types';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  findOne(filter: {
    where: {
      id?: number | string;
      email?: string;
      name?: string;
      surname?: string;
    };
  }): Promise<User> {
    return this.userModel.findOne({ ...filter });
  }

  async paginate(query: IUserQuery): Promise<{ count: number; rows: User[] }> {
    const limit = +query.limit;
    const offset = +query.offset * 20;
    console.log(query);

    return this.userModel.findAndCountAll({
      limit,
      offset,
      order: [['surname', 'ASC']],
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | { warningMessage: string }> {
    const user = await this.findOne({ where: { id: id } });
    if (!user) {
      return { warningMessage: 'Пользователь не найден' };
    }

    user.email = updateUserDto.email ?? user.email;
    user.name = updateUserDto.name ?? user.name;
    user.surname = updateUserDto.surname ?? user.surname;

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    user.hireDate = updateUserDto.hireDate ?? user.hireDate;
    user.role = updateUserDto.role ?? user.role;

    await user.save();
    return user;
  }

  async delete(userId: string): Promise<{ message: string }> {
    const user = await this.findOne({ where: { id: userId } });
    if (!user) {
      return { message: 'Пользователь не найден' };
    }

    await user.destroy();
    return { message: 'Пользователь удален' };
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<User | { warningMessage: string }> {
    const user = new User();
    const existingByEmail = await this.findOne({
      where: { email: createUserDto.email },
    });

    const existingByName = await this.findOne({
      where: { name: createUserDto.name },
    });

    const existingBySurname = await this.findOne({
      where: { surname: createUserDto.surname },
    });

    if (existingByEmail) {
      return {
        warningMessage: 'Сотрудник с таким электронным адресом уже существует',
      };
    }

    if (
      existingBySurname &&
      existingByName.surname === existingBySurname.surname &&
      existingByName.name === existingBySurname.name
    ) {
      return {
        warningMessage: 'Сотрудник с такой фамилией и именем уже существует',
      };
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    user.email = createUserDto.email.toLowerCase();
    user.name = createUserDto.name;
    user.surname = createUserDto.surname;
    user.password = hashedPassword;
    user.hireDate = createUserDto.hireDate;
    user.role = 'user';

    return user.save();
  }
}
