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

  findAll() {
    // vrne vse živali; owner/applications se ne eager-loadajo, razen če si nastavil eager drugje
    return this.repo.find({ relations: { owner: true } });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: { owner: true } });
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
      relations: { owner: true },
    });
    if (!animal) throw new NotFoundException('Animal not found');

    if (animal.owner?.id !== userId) {
      throw new ForbiddenException('Not your animal');
    }

    await this.repo.remove(animal);
    return { deleted: true };
  }
}
