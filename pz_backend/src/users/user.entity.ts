import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Animal } from '../animals/animal.entity';
import { AdoptionApplication } from '../adoption-applications/adoption-application.entity';
import { File } from '../files/file.entity';

export enum UserRole {
  USER = 'USER',
  SHELTER = 'SHELTER',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Animal, (a) => a.owner)
  animals: Animal[];

  @OneToMany(() => AdoptionApplication, (app) => app.applicant)
  applications: AdoptionApplication[];

  @OneToOne(() => File, (f) => f.user)
  avatar: File;
}
