import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.users.create({
      email: dto.email,
      passwordHash,
      role: dto.role ?? UserRole.USER,
      name: dto.name,
    });

    return this.issueToken(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return this.issueToken(user.id, user.email, user.role);
  }

  private issueToken(userId: number, email: string, role: UserRole) {
    return {
      access_token: this.jwt.sign({ sub: userId, email, role }),
    };
  }
}
