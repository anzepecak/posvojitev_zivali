import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';
import { UsersService } from '../users/users.service';
import { Animal } from '../animals/animal.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File) private readonly repo: Repository<File>,
    @InjectRepository(Animal) private readonly animalsRepo: Repository<Animal>,
    private readonly users: UsersService,
  ) {}

  async saveUserAvatar(params: {
    userId: number;
    filename: string;
    mimeType: string;
    size: number;
  }) {
    const user = await this.users.findById(params.userId);
    if (!user) throw new NotFoundException('User not found');

    if (user.avatar?.id) {
      await this.repo.delete({ id: user.avatar.id });
    }

    const dbFile = this.repo.create({
      filename: params.filename,
      path: `/uploads/avatars/${params.filename}`,
      mimeType: params.mimeType,
      size: params.size,
      user: user,
    });

    const saved = await this.repo.save(dbFile);

    return {
      id: saved.id,
      filename: saved.filename,
      url: saved.path,
      mimeType: saved.mimeType,
      size: saved.size,
    };
  }

  async saveAnimalImage(params: {
    animalId: number;
    ownerId: number;
    filename: string;
    mimeType: string;
    size: number;
  }) {
    const animal = await this.animalsRepo.findOne({
      where: { id: params.animalId },
      relations: { owner: true },
    });
    if (!animal) throw new NotFoundException('Animal not found');

    if (animal.owner?.id !== params.ownerId) {
      throw new ForbiddenException('Not your animal');
    }

    const dbFile = this.repo.create({
      filename: params.filename,
      path: `/uploads/animals/${params.filename}`,
      mimeType: params.mimeType,
      size: params.size,
      animal,
    });

    const saved = await this.repo.save(dbFile);

    return {
      id: saved.id,
      filename: saved.filename,
      url: saved.path,
      mimeType: saved.mimeType,
      size: saved.size,
    };
  }

  async deleteAnimalImage(params: {
    animalId: number;
    fileId: number;
    ownerId: number;
  }) {
    const animal = await this.animalsRepo.findOne({
      where: { id: params.animalId },
      relations: { owner: true, images: true },
    });

    if (!animal) throw new NotFoundException('Animal not found');

    if (animal.owner?.id !== params.ownerId) {
      throw new ForbiddenException('Not your animal');
    }

    const file = animal.images.find((f) => f.id === params.fileId);

    if (!file) throw new NotFoundException('Image not found');

    await this.repo.remove(file);

    return { deleted: true };
  }
}
