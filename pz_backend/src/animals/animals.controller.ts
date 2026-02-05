import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { FilesService } from '../files/files.service';

function makeFilename(_req: any, file: any, cb: any) {
  const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  cb(null, unique + extname(file.originalname));
}

function imageFileFilter(_req: any, file: any, cb: any) {
  if (!file.mimetype?.startsWith('image/')) {
    return cb(new BadRequestException('Only image files are allowed'), false);
  }
  cb(null, true);
}

@Controller('animals')
export class AnimalsController {
  constructor(
    private readonly animals: AnimalsService,
    private readonly files: FilesService,
  ) {}

  @Get()
  findAll() {
    return this.animals.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.animals.findOne(+id);
  }

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

  @UseGuards(JwtAuthGuard)
  @Post(':id/images')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/animals',
        filename: makeFilename,
      }),
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadAnimalImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    if (!file) throw new BadRequestException('No file provided');

    return this.files.saveAnimalImage({
      animalId: +id,
      ownerId: user.id,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':animalId/images/:fileId')
  deleteAnimalImage(
    @Param('animalId') animalId: string,
    @Param('fileId') fileId: string,
    @CurrentUser() user: any,
  ) {
    return this.files.deleteAnimalImage({
      animalId: +animalId,
      fileId: +fileId,
      ownerId: user.id,
    });
  }
}
