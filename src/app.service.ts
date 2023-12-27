// app.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CryptographyService } from './cryptography.service';
import { UserService } from './users/users.service';
import { SendMessageDto } from './users/dto/send-message.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly userService: UserService,
    private readonly cryptographyService: CryptographyService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async generateKeyPair(): Promise<{ privateKey: string; publicKey: string }> {
    return this.cryptographyService.generateRSAKeyPair();
  }

  async generateSessionKey({ sender, receiver }: SendMessageDto): Promise<any> {
    const senderUser = await this.userService.findUserByUsername(sender);
    const receiverUser = await this.userService.findUserByUsername(receiver);

    if (!senderUser || !receiverUser) {
      throw new NotFoundException('User not found');
    }

    const sessionKey = this.cryptographyService.generateSessionKey();

    const encryptedSessionKeyForSender =
      this.cryptographyService.encryptSessionKey(
        sessionKey,
        receiverUser.publicKey,
      );

    const encryptedSessionKeyForReceiver =
      this.cryptographyService.encryptSessionKey(
        sessionKey,
        senderUser.publicKey,
      );

    return {
      senderEncryptedKey: encryptedSessionKeyForSender,
      receiverEncryptedKey: encryptedSessionKeyForReceiver,
    };
  }

  async decryptMessage({
    sender,
    receiver,
    message: encryptedMessage,
  }: SendMessageDto): Promise<string> {
    const senderUser = await this.userService.findUserByUsername(sender);
    const receiverUser = await this.userService.findUserByUsername(receiver);

    if (!senderUser || !receiverUser) {
      throw new NotFoundException('User not found');
    }

    const sessionKeyForReceiver = this.cryptographyService.decryptSessionKey(
      encryptedMessage,
      receiverUser.publicKey,
    );

    const decryptedMessage = this.cryptographyService.decryptMessage(
      encryptedMessage,
      sessionKeyForReceiver,
    );

    return decryptedMessage;
  }
}
