// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerUser(username: string, publicKey: string): Promise<User> {
    const user = this.userRepository.create({ username, publicKey });
    return this.userRepository.save(user);
  }

  async findUserByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }
}
