import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { CreateUserDto } from 'src/user/dto/create.user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findOne(email, true);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      void password;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, id: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async me(user: User) {
    return await this.userService.findById(user.id);
  }

  async register(user: CreateUserDto) {
    const existingUser = await this.userService.findOne(user.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await this.userService.create({
      ...user,
      password: hashedPassword,
    });

    const payload = { email: newUser.email, id: newUser.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
