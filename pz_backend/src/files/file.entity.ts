import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  mimeType: string;

  @Column({ type: 'int', nullable: true })
  size: number;

  @OneToOne(() => User, (u) => u.avatar, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
