import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { UsersModule } from '../users/users.module';
import { Animal } from '../animals/animal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([File, Animal]), UsersModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
