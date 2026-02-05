import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Animal } from './animal.entity';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectRepository(Animal)
    private readonly repo: Repository<Animal>,
  ) {}

  async findAll() {
    const animals = await this.repo.find({
      relations: ['applications'],
    });

    return animals.filter(
      (a) => !a.applications?.some((app) => app.status === 'POSVOJENO'),
    );
  }

  async findOne(id: number) {
    const animal = await this.repo.findOne({
      where: { id },
      relations: {
        owner: true,
        images: true,
        applications: true,
      },
    });

    if (!animal) throw new NotFoundException('Animal not found');
    return animal;
  }

  create(dto: CreateAnimalDto, userId: number) {
    // “owner” lahko nastavimo tudi samo z id (TypeORM bo naredil FK)
    const animal = this.repo.create({
      ...dto,
      owner: { id: userId } as any,
    });
    return this.repo.save(animal);
  }

  async update(id: number, dto: UpdateAnimalDto, userId: number) {
    const animal = await this.repo.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!animal) throw new NotFoundException('Animal not found');

    if (animal.owner?.id !== userId) {
      throw new ForbiddenException('Not your animal');
    }

    Object.assign(animal, dto);
    return this.repo.save(animal);
  }

  async remove(id: number, userId: number) {
    const animal = await this.repo.findOne({
      where: { id },
      relations: {
        owner: true,
        images: true,
      },
    });
    if (!animal) throw new NotFoundException('Animal not found');

    if (animal.owner?.id !== userId) {
      throw new ForbiddenException('Not your animal');
    }

    await this.repo.remove(animal);
    return { deleted: true };
  }
}
