import { Entity } from 'typeorm';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';


export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  BUSINESS = 'business',
}
@Entity('auth_users')
export class AuthUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: true })
  password_hash: string;

  @Column({type: 'enum', enum: Role, default: Role.USER})
  role: Role;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
