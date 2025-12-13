import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthBusiness } from './entities/auth-business.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(AuthBusiness)
    private readonly businessRepository: Repository<AuthBusiness>,
  ) {}

  async create(data: object): Promise<AuthBusiness> {
    return this.businessRepository.save(data as AuthBusiness);
  }

  // 1. G
  async findOneByEmail(business_email: string): Promise<AuthBusiness | null> {
    const business = await this.businessRepository.findOne({
      where: { business_email },
      select: ['id', 'business_email', 'role'],
    });
    return business || null;
  }

  async findOneByEmailWithHash(
    business_email: string,
  ): Promise<AuthBusiness | null> {
    const business = await this.businessRepository.findOne({
      where: { business_email },
      select: ['id', 'business_email', 'role', 'password_hash'],
    });
    return business || null;
  }

  async findOneById(id: string): Promise<AuthBusiness | null> {
    const business = await this.businessRepository.findOne({ where: { id } });
    return business || null;
  }
}
