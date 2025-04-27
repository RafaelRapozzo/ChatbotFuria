import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/createuser.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get('find-by-email')
  async getUserByEmail(@Query() email: string) {
    return this.userService.getUser(email);
  }
}
