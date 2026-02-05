import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Animal } from '../animals/animal.entity';
import { File } from '../files/file.entity';
import { AdoptionApplication } from '../adoption-applications/adoption-application.entity';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({default: '' })
  name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Animal, (a) => a.owner)
  animals: Animal[];

  @OneToOne(() => File, (f) => f.user, { nullable: true })
  avatar?: File;

  @OneToMany(() => AdoptionApplication, (app) => app.user)
  applications: AdoptionApplication[];
}
