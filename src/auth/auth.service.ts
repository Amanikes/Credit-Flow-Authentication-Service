import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
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

  async signup(dto: CreateUserDto) {
    // Check if the user already exists
    const exists = await this.userService.findByEmail(dto['email']);
    if (exists)
      throw new BadRequestException('User with this email already exists');

    // Hash the password
    const hashedPassword = await bcrypt.hash(dto.password, 10,);

    // Create the user
    const user = await this.userService.create({
      ...dto,
      password: hashedPassword,
    });

    //Generate token

    const token = await this.jwtService.signAsync({sub: user.id});

    return {message: 'User created successfully', token, user};
  }

  async signin(dto: { email: string; password: string }) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid)
      throw new UnauthorizedException('Invalid credentials');

    const token = await this.jwtService.signAsync({sub: user.id});

    return { message: 'Signin successful', token };
  }
}
