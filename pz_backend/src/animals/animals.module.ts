import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Animal } from './animal.entity';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([Animal]), FilesModule],
  controllers: [AnimalsController],
  providers: [AnimalsService],
})
export class AnimalsModule {}
