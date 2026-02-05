import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Animal } from '../animals/animal.entity';

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

  // avatar uporabnika (1:1)
  @OneToOne(() => User, (u) => u.avatar, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  user?: User;

  // slike živali (N:1)
  @ManyToOne(() => Animal, (a) => a.images, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  animal?: Animal;
}
