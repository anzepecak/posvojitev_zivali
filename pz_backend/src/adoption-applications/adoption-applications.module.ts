import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdoptionApplicationsController } from './adoption-applications.controller';
import { AdoptionApplicationsService } from './adoption-applications.service';
import { AdoptionApplication } from './adoption-application.entity';
import { Animal } from '../animals/animal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdoptionApplication, Animal])],
  controllers: [AdoptionApplicationsController],
  providers: [AdoptionApplicationsService],
})
export class AdoptionApplicationsModule {}
