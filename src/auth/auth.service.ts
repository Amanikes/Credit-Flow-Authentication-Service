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
import { AuthBusiness } from 'src/business/entities/auth-business.entity';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly businessService: BusinessService,
    @InjectRepository(AuthUser)
    private readonly userRepository: Repository<AuthUser>,

    @InjectRepository(AuthBusiness)
    private readonly businessRepository: Repository<AuthBusiness>,

    private readonly jwtService: JwtService,

    private readonly tokensService: TokensService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async generateToken(user): Promise<string> {
    const token = this.jwtService.signAsync({
      sub: user.id,
      role: user.role,
      email: user.email || user.businessEmail,
    });
    return token;
  }

  async generateRefreshToken(user): Promise<string> {
    const refreshToken = this.jwtService.signAsync(
      {
        sub: user.id,
        role: user.role,
        email: user.email || user.businessEmail,
      },
      { expiresIn: '7d' },
    );
    return refreshToken;
  }

  async validateUSER(dto) {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await this.validatePassword(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.generateToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    await this.tokensService.saveRefreshToken(user.id, refreshToken);

    return {
      message: 'Login successful',
      accessToken: token,
      refreshToken: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async registerUser(dto) {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (user) {
      throw new BadRequestException('Email already in use');
    }
    const passwordHash = await this.hashPassword(dto.password);
    const newUser = this.userRepository.create({
      email: dto.email,
      passwordHash,
      role: Role.USER,
    });
    await this.userRepository.save(newUser);

    return {
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }

  async registerBusiness(dto) {
    const business = await this.businessService.findOneByEmailWithHash(
      dto.businessEmail,
    );
    if (business) {
      throw new BadRequestException('Business email already in use');
    }
    const passwordHash = await this.hashPassword(dto.password);
    const newBusiness = this.businessRepository.create({
      businessEmail: dto.businessEmail,
      passwordHash,
      role: Role.BUSINESS,
    });
    await this.businessRepository.save(newBusiness);

    return {
      message: 'Business registered successfully',
      business: {
        id: newBusiness.id,
        email: newBusiness.businessEmail,
        role: newBusiness.role,
      },
    };
  }

  async validateBusiness(dto) {
    const business = await this.businessService.findOneByEmailWithHash(
      dto.businessEmail,
    );
    if (!business || !business.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await this.validatePassword(
      dto.password,
      business.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.generateToken(business);
    const refreshToken = await this.generateRefreshToken(business);

    await this.tokensService.saveRefreshToken(business.id, refreshToken);

    return {
      message: 'Login successful',
      accessToken: token,
      refreshToken: refreshToken,
      business: {
        id: business.id,
        email: business.businessEmail,
        role: business.role,
      },
    };
  }
}
