import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Animal } from '../animals/animal.entity';

export enum AdoptionStatus {
  VLOGA_ODDANA = 'VLOGA_ODDANA',
  INTERVJU_OPRAVLJEN = 'INTERVJU_OPRAVLJEN',
  POSVOJENO = 'POSVOJENO',
  ZAVRNJENO = 'ZAVRNJENO',
}

@Entity('adoption_applications')
export class AdoptionApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (u) => u.applications, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Animal, (a) => a.applications, { onDelete: 'CASCADE' })
  animal: Animal;

  @Column({
    type: 'enum',
    enum: AdoptionStatus,
    default: AdoptionStatus.VLOGA_ODDANA,
  })
  status: AdoptionStatus;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @CreateDateColumn()
  createdAt: Date;
}
