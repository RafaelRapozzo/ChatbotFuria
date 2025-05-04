import { Body, Controller, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserByEmailDTO } from './dto/find-user-email.dto';
import { UpdateUserTeamDto } from './dto/update-user-team.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('find-by-email')
  @ApiOperation({ summary: 'Buscar usuário por email' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
    schema: {
      properties: {
        exists: { type: 'boolean' },
        user: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            favgame: { type: 'string' },
          },
        },
        message: { type: 'string' },
      },
    },
  })
  async getUserByEmail(@Body() body: FindUserByEmailDTO) {
    return this.userService.getUser(body.email);
  }

  @Patch('update-team')
  @ApiOperation({ summary: 'Atualizar time favorito do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Time atualizado com sucesso',
    type: UpdateUserTeamDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async updateTeam(@Body() body: UpdateUserTeamDto) {
    return this.userService.updateTeam(body);
  }
}
