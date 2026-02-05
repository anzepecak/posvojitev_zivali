import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { AdoptionApplication } from '../adoption-applications/adoption-application.entity';
import { File } from '../files/file.entity';

@Entity('animals')
export class Animal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  species: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User, (u) => u.animals, { onDelete: 'CASCADE' })
  owner: User;

  @OneToMany(() => AdoptionApplication, (app) => app.animal)
  applications: AdoptionApplication[];

  @OneToMany(() => File, (f) => f.animal)
  images: File[];
}
