// app.controller.ts
import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { CryptographyService } from './cryptography.service';
import { UserService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly cryptographyService: CryptographyService,
  ) {}

  @Get()
  getHello(): string {
    return 'Welcome to Key Distribution Center';
  }

  @Post('generate-session-key')
  async generateSessionKey(
    @Body() body: { sender: string; receiver: string },
  ): Promise<any> {
    const { sender, receiver } = body;
    const senderUser = await this.userService.findUserByUsername(sender);
    const receiverUser = await this.userService.findUserByUsername(receiver);

    if (!senderUser || !receiverUser) {
      throw new NotFoundException('User not found');
    }

    const sessionKey = this.cryptographyService.generateSessionKey();
    const encryptedSessionKeyForSender =
      this.cryptographyService.encryptWithRSA(
        sessionKey,
        receiverUser.publicKey,
      );
    const encryptedSessionKeyForReceiver =
      this.cryptographyService.encryptWithRSA(sessionKey, senderUser.publicKey);

    return {
      senderEncryptedKey: encryptedSessionKeyForSender,
      receiverEncryptedKey: encryptedSessionKeyForReceiver,
    };
  }
}
