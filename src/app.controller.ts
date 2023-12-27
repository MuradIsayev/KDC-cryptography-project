import { Body, Controller, Get, Post } from '@nestjs/common';
import { SendMessageDto } from './users/dto/send-message.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('generate-session-key')
  async generateSessionKey(@Body() sendMessageDto: SendMessageDto) {
    return await this.appService.generateSessionKey(sendMessageDto);
  }
}
