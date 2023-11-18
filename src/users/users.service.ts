import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  findOne(filter: {
    where: {
      id?: string;
      email?: string;
      name?: string;
      surname?: string;
    };
  }): Promise<User> {
    return this.userModel.findOne({ ...filter });
  }

  // Update
  // async update(
  //   updateUserDto: UpdateUserDto,
  // ): Promise<User | { warningMessage: string }> {
  //   const user = new User();
  //   const existingById = await this.findOne({
  //     where: { id: updateUserDto.id },
  //   });
  //
  //   const hashedPassword = await bcrypt.hash(UpdateUserDto.password, 10);
  //
  //   return user.save();
  // }

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

    return user.save();
  }
}
