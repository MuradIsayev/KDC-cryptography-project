// cryptography.service.ts
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptographyService {
  generateSessionKey(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  encryptWithRSA(data: string, publicKey: string): string {
    const buffer = Buffer.from(data, 'utf-8');
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString('base64');
  }

  decryptWithRSA(encryptedData: string, privateKey: string): string {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString('utf-8');
  }
}
