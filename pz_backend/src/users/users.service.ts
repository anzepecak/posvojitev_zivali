import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.repo.findOne({
      where: { email },
      relations: { avatar: true },
    });
  }

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: { avatar: true },
    });
  }

  async create(data: {
    email: string;
    passwordHash: string;
    role: UserRole;
    name: string;
  }) {
    const existing = await this.repo.findOne({ where: { email: data.email } });
    if (existing) throw new BadRequestException('Email already in use');

    const user = this.repo.create({
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role,
      name: data.name,
    });

    return this.repo.save(user);
  }
}
