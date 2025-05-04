import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UpdateUserTeamDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Time favorito (csgo, valorant ou lol)',
    example: 'csgo',
    enum: ['csgo', 'valorant', 'lol'],
  })
  @IsString()
  favgame: string;
}
