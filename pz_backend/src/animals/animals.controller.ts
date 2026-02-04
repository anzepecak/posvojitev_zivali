import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animals: AnimalsService) {}

  // PUBLIC
  @Get()
  findAll() {
    return this.animals.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.animals.findOne(+id);
  }

  // PROTECTED
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateAnimalDto, @CurrentUser() user: any) {
    return this.animals.create(dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAnimalDto,
    @CurrentUser() user: any,
  ) {
    return this.animals.update(+id, dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.animals.remove(+id, user.id);
  }
}
