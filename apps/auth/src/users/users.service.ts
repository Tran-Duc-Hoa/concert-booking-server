import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { RegisterDto } from '../dto/register.dto';
import { User } from './user.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger();
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(userData: RegisterDto): Promise<User> {
    const passwordHash = await bcrypt.hash(userData.password, 10);

    return this.usersRepository.create({
      ...userData,
      passwordHash,
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ email });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ _id: new Types.ObjectId(id) });
  }
}
