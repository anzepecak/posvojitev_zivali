import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AdoptionApplicationsService } from './adoption-applications.service';
import { CreateAdoptionApplicationDto } from './dto/create-adoption-application.dto';
import { UpdateAdoptionStatusDto } from './dto/update-adoption-status.dto';

@Controller('adoption-applications')
export class AdoptionApplicationsController {
  constructor(private readonly apps: AdoptionApplicationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateAdoptionApplicationDto, @CurrentUser() user: any) {
    return this.apps.create(dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  my(@CurrentUser() user: any) {
    return this.apps.findMine(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('animal/:animalId')
  forAnimal(@Param('animalId') animalId: string, @CurrentUser() user: any) {
    const isAdmin = user?.role === 'ADMIN';
    return this.apps.findForAnimal(+animalId, user.id, isAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAdoptionStatusDto,
    @CurrentUser() user: any,
  ) {
    const isAdmin = user?.role === 'ADMIN';
    return this.apps.updateStatus(+id, dto.status, user.id, isAdmin);
  }
}
