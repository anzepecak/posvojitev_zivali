import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdoptionApplication } from './adoption-application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdoptionApplication])],
  exports: [TypeOrmModule],
})
export class AdoptionApplicationsModule {}
