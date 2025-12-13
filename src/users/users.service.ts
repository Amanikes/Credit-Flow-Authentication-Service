import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthUser } from './entities/auth-user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(AuthUser)
    private readonly userRepository: Repository<AuthUser>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<AuthUser> {
    const user = this.userRepository.create({
      email: createUserDto.email,
      password_hash: createUserDto.password, // In real application, hash the password
    });
    return this.userRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<AuthUser| null> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    return user || null;
  }

  
  async findOneById(id: string): Promise<AuthUser> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      return user;
    }
    throw new (await import('@nestjs/common')).NotFoundException(
      'User not found',
    );
  }
}
