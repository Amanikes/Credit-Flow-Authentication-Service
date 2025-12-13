import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity('auth_refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() subject_id: string; // FK to AuthUser.id or AuthBusiness.id
  @Column() subject_type: 'user' | 'business';
  @Column({select:false}) token_hash: string;
  @Column() expires_at: Date;
  @Column({default:false}) revoked: boolean;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}
