import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
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

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }
}
