import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
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

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: TokenPayload = { userId: user._id.toString() };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  getHello(): string {
    return 'Hello World!';
  }
}
