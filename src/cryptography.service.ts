import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptographyService {
  generateSessionKey(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  generateRSAKeyPair(): { privateKey: string; publicKey: string } {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    return { privateKey, publicKey };
  }

  encryptSessionKey(sessionKey: string, publicKey: string) {
    const encryptedMessage = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(sessionKey),
    );

    return encryptedMessage.toString('base64');
  }

  decryptSessionKey(encryptedSessionKey: string, privateKey: string) {
    const decryptedMessage = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(encryptedSessionKey, 'base64'),
    );

    return decryptedMessage.toString();
  }

  encryptMessage(decryptedMessage: string, sessionKey: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-gcm',
      Buffer.from(sessionKey, 'hex'),
      iv,
    );
    const encrypted = Buffer.concat([
      cipher.update(decryptedMessage, 'utf-8'),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    const encryptedMessage = Buffer.concat([iv, tag, encrypted]).toString(
      'hex',
    );
    return encryptedMessage;
  }

  decryptMessage(encryptedMessage: string, sessionKey: string): string {
    const data = Buffer.from(encryptedMessage, 'hex');
    const iv = data.slice(0, 16);
    const tag = data.slice(16, 32);
    const encrypted = data.slice(32);

    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      Buffer.from(sessionKey, 'hex'),
      iv,
    );
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]).toString('utf-8');

    return decrypted;
  }
}
