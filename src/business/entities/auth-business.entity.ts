import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from 'src/users/entities/auth-user.entity';
@Entity('auth_businesses')
export class AuthBusiness {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  business_email: string;

  @Column({ select: false })
  password_hash: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'enum', enum: Role, default: Role.BUSINESS })
  role: Role;
}
