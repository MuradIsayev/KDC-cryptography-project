import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registerUser(@Body() body: CreateUserDto): Promise<any> {
    const { username, publicKey } = body;
    const user = await this.userService.registerUser(username, publicKey);
    return { message: 'User registered successfully', user };
  }
}
