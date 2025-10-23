import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async create(data: CreateUserDto) {
    return await this.prisma.user.create({ data });
  }

  async update(id: string, data: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async findOne(email: string, includePassword = false) {
    if (includePassword) {
      return await this.prisma.user.findFirst({
        where: { email },
        omit: { password: false },
      });
    }
    return await this.prisma.user.findFirst({
      where: { email },
    });
  }

  async findById(id: string, includePassword = false) {
    if (includePassword) {
      return await this.prisma.user.findUnique({
        where: { id },
        omit: { password: false },
      });
    }
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }
}
