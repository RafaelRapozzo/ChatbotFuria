import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createuser.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        favgame: data.favgame,
      },
    });
  }
  async getUser(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }
}
