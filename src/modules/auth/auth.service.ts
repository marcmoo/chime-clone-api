import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AccountsService } from '../accounts/accounts.service';
import { SignupInput } from './dto/signup.input';
import { User } from '../users/entities/user.entity';
import { AccountType } from '../../common/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly accountsService: AccountsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User Not Found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect Password');
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async signup(signupInput: SignupInput) {
    const existingUser = await this.usersService.findByEmail(signupInput.email);
    if (existingUser) {
      throw new ConflictException('Email Address Has Already Been Taken');
    }

    const saltRounds = Number(this.configService.get<string>('HASH_SALT_ROUNDS'));
    const hashedPassword = await bcrypt.hash(signupInput.password, saltRounds);

    const user = await this.usersService.create({
      ...signupInput,
      password: hashedPassword,
    });

    await this.accountsService.create(user.id, { accountType: AccountType.CHECKING });
    await this.accountsService.create(user.id, { accountType: AccountType.SAVINGS });

    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}
