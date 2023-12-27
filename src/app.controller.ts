import { Body, Controller, Get, Post } from '@nestjs/common';
import { MessageDto } from './users/dto/message.dto';
import { AppService } from './app.service';
import { GenerateSessionKeyDto } from './users/dto/generate-session-key.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/keys')
  async generateKeys() {
    return await this.appService.generateKeyPair();
  }

  @Post('/generate-session-key')
  async generateSessionKey(
    @Body() generateSessionKeyDto: GenerateSessionKeyDto,
  ) {
    return await this.appService.generateSessionKey(generateSessionKeyDto);
  }

  @Post('/encrypt-message')
  async encryptMessage(@Body() messageDto: MessageDto) {
    return await this.appService.encryptMessage(messageDto);
  }

  @Post('/decrypt-message')
  async decryptMessage(@Body() messageDto: MessageDto) {
    return await this.appService.decryptMessage(messageDto);
  }
}
