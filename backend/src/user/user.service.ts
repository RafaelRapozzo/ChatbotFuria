import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserTeamDto } from './dto/update-user-team.dto';

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
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        favgame: true,
        name: true,
      },
    });
    if (user) {
      return { exists: true, user, message: 'Usuário já cadastrado!' };
    } else {
      return {
        exists: false,
        message: 'Usuário não encontrado, siga com o cadastro.',
      };
    }
  }
  async updateTeam(body: UpdateUserTeamDto) {
    const user = await this.prisma.user.update({
      where: {
        email: body.email,
      },
      data: {
        favgame: body.favgame,
      },
    });
    return user;
  }
}
