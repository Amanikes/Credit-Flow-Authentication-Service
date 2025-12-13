import { Inject, Injectable } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { AuthBusiness } from './entities/auth-business.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(AuthBusiness)
    private readonly businessRepository: Repository<AuthBusiness>

  ){}

  async create(data: object){
    return this.businessRepository.save(data)
  }

  async findOneByEmail(business_email: string) {
    const business = await this.businessRepository.findOne({ where: { business_email } });
    if(business){
      return true;
    }
    throw new Error('Business not found');
  }

  async findOneById(id: string): Promise<boolean> {
    const business =  await this.businessRepository.findOne({ where: { id } });
    if(business){
      return true;
    }
    throw new Error('Business not found');
  }
}

