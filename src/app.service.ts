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

  async generateSessionKey({
    sender,
    receiver,
    message,
  }: SendMessageDto): Promise<any> {
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
