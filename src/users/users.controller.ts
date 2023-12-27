import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.registerUser(createUserDto);
    return { message: 'User registered successfully', user };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const user = await this.userService.deleteUser(+id);
    return { message: 'User deleted successfully', user };
  }

  @Get('users')
  async getAllUsers() {
    const users = await this.userService.findAllUsers();
    return { users };
  }
}
