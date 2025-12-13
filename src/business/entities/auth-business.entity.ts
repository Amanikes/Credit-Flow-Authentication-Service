import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('auth_businesses')
export class AuthBusiness {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) business_email: string;
  @Column({ select: false }) password_hash: string;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}
