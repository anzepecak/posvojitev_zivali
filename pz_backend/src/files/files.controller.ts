import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { FilesService } from './files.service';

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

@Controller('files')
export class FilesController {
  constructor(private readonly files: FilesService) {}

  // ✅ test če controller sploh obstaja
  @Get('ping')
  ping() {
    return { ok: true };
  }

  // =========================
  // USER AVATAR
  // =========================
  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: makeFilename,
      }),
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    if (!file) throw new BadRequestException('No file provided');

    return this.files.saveUserAvatar({
      userId: user.id,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
    });
  }

  // =========================
  // ANIMAL IMAGE UPLOAD
  // =========================
  @UseGuards(JwtAuthGuard)
  @Post('animal/:animalId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/animals',
        filename: makeFilename,
      }),
      fileFilter: imageFileFilter,
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadAnimalImage(
    @Param('animalId') animalId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    const id = Number(animalId);
    if (!Number.isFinite(id)) throw new BadRequestException('Invalid animalId');
    if (!file) throw new BadRequestException('No file provided');

    return this.files.saveAnimalImage({
      animalId: id,
      ownerId: user.id,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
    });

  }
}
