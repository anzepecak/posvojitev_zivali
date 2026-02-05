import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: any) {
    const dbUser = await this.users.findById(user.id);

    return {
      id: dbUser?.id,
      email: dbUser?.email,
      role: dbUser?.role,
      avatarUrl: dbUser?.avatar?.path ?? null, // npr. /uploads/xxx.jpg
    };
  }
}
