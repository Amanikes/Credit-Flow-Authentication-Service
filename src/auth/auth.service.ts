import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { BusinessService } from 'src/business/business.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { AuthUser, Role } from 'src/users/entities/auth-user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly businessService: BusinessService,
    @InjectRepository(AuthUser)
    private readonly userRepository: Repository<AuthUser>,
    private readonly JwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async generateToken(user: AuthUser): Promise<string> {
    const token = this.JwtService.sign({ sub: user.id, role: user.role });
    return token;
  }

  async validateUser(dto) {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await this.validatePassword(
      dto.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.generateToken(user);
    return user.email, token;
  }

  async registerUser(dto){
    const user = await this.usersService.findOneByEmail(dto.email);
    if(user){
      throw new BadRequestException('Email already in use');
    }
    const password_hash = await this.hashPassword(dto.password);
    const newUser = this.userRepository.create({
      email: dto.email,
      password_hash,
      role: Role.USER,
    });

    return this.userRepository.save(newUser);

    
  }
}
