import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AdoptionApplication,
  AdoptionStatus,
} from './adoption-application.entity';
import { Animal } from '../animals/animal.entity';

@Injectable()
export class AdoptionApplicationsService {
  constructor(
    @InjectRepository(AdoptionApplication)
    private readonly repo: Repository<AdoptionApplication>,
    @InjectRepository(Animal)
    private readonly animalsRepo: Repository<Animal>,
  ) {}

  async create(dto: { animalId: number; message?: string }, userId: number) {
    const animal = await this.animalsRepo.findOne({
      where: { id: dto.animalId },
      relations: { owner: true, applications: true },
    });
    if (!animal) throw new NotFoundException('Animal not found');

    const adopted = animal.applications?.some(
      (a) => a.status === AdoptionStatus.POSVOJENO,
    );
    if (adopted) {
      throw new BadRequestException('Animal already adopted');
    }

    const existing = await this.repo.findOne({
      where: {
        animal: { id: dto.animalId } as any,
        user: { id: userId } as any,
      },
      relations: { animal: true, user: true },
    });

    if (existing && existing.status !== AdoptionStatus.ZAVRNJENO) {
      throw new BadRequestException('Application already exists');
    }

    const app = this.repo.create({
      animal: { id: dto.animalId } as any,
      user: { id: userId } as any,
      message: dto.message,
      status: AdoptionStatus.VLOGA_ODDANA,
    });

    return this.repo.save(app);
  }

  findMine(userId: number) {
    return this.repo.find({
      where: { user: { id: userId } as any },
      relations: { animal: true },
      order: { id: 'DESC' },
    });
  }

  async findForAnimal(animalId: number, ownerId: number) {
    const animal = await this.animalsRepo.findOne({
      where: { id: animalId },
      relations: { owner: true },
    });
    if (!animal) throw new NotFoundException('Animal not found');
    if (animal.owner?.id !== ownerId) {
      throw new ForbiddenException('Not your animal');
    }

    return this.repo.find({
      where: { animal: { id: animalId } as any },
      relations: { user: true, animal: true },
      order: { id: 'DESC' },
    });
  }

  async updateStatus(appId: number, status: AdoptionStatus, ownerId: number) {
    const app = await this.repo.findOne({
      where: { id: appId },
      relations: { animal: { owner: true }, user: true },
    });
    if (!app) throw new NotFoundException('Application not found');
    if (app.animal?.owner?.id !== ownerId) {
      throw new ForbiddenException('Not your animal');
    }

    const valid =
      (app.status === AdoptionStatus.VLOGA_ODDANA &&
        (status === AdoptionStatus.INTERVJU_OPRAVLJEN ||
          status === AdoptionStatus.ZAVRNJENO)) ||
      (app.status === AdoptionStatus.INTERVJU_OPRAVLJEN &&
        (status === AdoptionStatus.POSVOJENO ||
          status === AdoptionStatus.ZAVRNJENO));

    if (!valid) throw new BadRequestException('Invalid status transition');

    if (status === AdoptionStatus.POSVOJENO) {
      const already = await this.repo.findOne({
        where: {
          animal: { id: app.animal.id } as any,
          status: AdoptionStatus.POSVOJENO,
        },
      });
      if (already) throw new BadRequestException('Animal already adopted');
    }

    app.status = status;
    return this.repo.save(app);
  }
}
