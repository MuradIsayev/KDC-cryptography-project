import { Injectable, NotFoundException } from '@nestjs/common';
import { CryptographyService } from './cryptography.service';
import { UserService } from './users/users.service';
import { GenerateSessionKeyDto } from './users/dto/generate-session-key.dto';
import { MessageDto } from './users/dto/message.dto';

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

  async generateSessionKey({
    sender,
    receiver,
  }: GenerateSessionKeyDto): Promise<any> {
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

  async encryptMessage(messageDto: MessageDto): Promise<string> {
    const { sender, receiver, message, sessionKey } = messageDto;

    const senderUser = await this.userService.findUserByUsername(sender);
    const receiverUser = await this.userService.findUserByUsername(receiver);

    if (!senderUser || !receiverUser) {
      throw new NotFoundException('Sender or receiver not found');
    }

    // Encrypt the message using the session key
    const encryptedMessage = this.cryptographyService.encryptMessage(
      message,
      sessionKey,
    );

    return encryptedMessage;
  }

  async decryptMessage(messageDto: MessageDto): Promise<string> {
    const { sender, receiver, message, sessionKey } = messageDto;

    const senderUser = await this.userService.findUserByUsername(sender);
    const receiverUser = await this.userService.findUserByUsername(receiver);

    if (!senderUser || !receiverUser) {
      throw new NotFoundException('Sender or receiver not found');
    }

    // Decrypt the message using the session key
    const decryptedMessage = this.cryptographyService.decryptMessage(
      message,
      sessionKey,
    );

    return decryptedMessage;
  }
}
