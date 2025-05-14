import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { User } from './users/user.schema';
import { UsersService } from './users/users.service';

export interface TokenPayload {
  userId: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger();
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      this.logger.debug('register', registerDto);
      const { email, password } = registerDto;

      const existingUserByEmail = await this.usersService.findOneByEmail(email);
      if (existingUserByEmail) {
        throw new BadRequestException('Email already registered');
      }

      this.logger.debug('existingUserByEmail', existingUserByEmail);
      const user = await this.usersService.create({
        email,
        password: password,
      });

      return user;
    } catch (error) {
      this.logger.debug('error', error);
      throw new InternalServerErrorException(error);
    }
  }

  async login(user: User, res: Response) {
    const payload: TokenPayload = { userId: user._id.toString() };
    const accessToken = await this.jwtService.signAsync(payload);

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + +this.configService.get('JWT_EXPIRES_IN'),
    );

    res.cookie('Authentication', accessToken, {
      httpOnly: true,
      expires,
    });
  }
}
