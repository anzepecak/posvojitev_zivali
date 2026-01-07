import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Animal } from '../animals/animal.entity';
import { ApplicationStatus } from './application-status.enum';

@Entity('adoption_applications')
export class AdoptionApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (u) => u.applications, { onDelete: 'CASCADE' })
  applicant: User;

  @ManyToOne(() => Animal, (a) => a.applications, { onDelete: 'CASCADE' })
  animal: Animal;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.VLOGA_ODDANA,
  })
  status: ApplicationStatus;

  @CreateDateColumn()
  createdAt: Date;
}
