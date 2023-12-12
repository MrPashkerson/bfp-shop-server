import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne({ where: { email: email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user && passwordValid) {
      return {
        userId: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        hireDate: user.hireDate,
        role: user.role,
      };
    }

    return null;
  }
}
