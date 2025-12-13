import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('/user/register')
  async registerUser(@Body() dto: CreateUserDto) {

    return this.authService.registerUser(dto);
  }

  @Post('/user/login')
  async loginUser(@Body() dto: LoginDto) {
    return this.authService.validateUser(dto);
  }
  
}
