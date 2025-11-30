import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { first } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async verifyPassword(
    givenPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(givenPassword, storedPassword);
  }

  async signup(dto: CreateUserDto) {
    const exists = await this.userService.findByEmail(dto.email);
    if (exists)
      throw new BadRequestException('User with this email already exists');

    const hashedPassword = await this.hashPassword(dto.password);

    const user = await this.userService.create({
      ...dto,
      password: hashedPassword,
    });



    const token = await this.jwtService.signAsync({
      sub: user.id,
      role: user.role,
    });

    return { message: 'User created successfully', token };
  }

  async signin(dto: { email: string; password: string }) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new NotFoundException('User not found');

    const passwordValid = await this.verifyPassword(
      dto.password,
      user.password,
    );
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    const token = await this.jwtService.signAsync({
      sub: user.id,
      role: user.role,
    });

    return { message: 'Signin successful', token };
  }
}
