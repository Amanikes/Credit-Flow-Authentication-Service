import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { CreateBusinessDto } from 'src/business/dto/create-business.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('/user/register')
  async registerUser(@Body() dto: CreateUserDto) {

    return this.authService.registerUser(dto);
  }

  @Post('/user/login')
  async loginUser(@Body() dto: LoginDto) {
    return this.authService.validateUSER(dto);
  }

  @Post('/business/register')
  async registerBusiness(@Body() dto: CreateBusinessDto) {
    return this.authService.registerBusiness(dto);
  }
  
  @Post('/business/login')
  async loginBusiness(@Body() dto: LoginDto) {
    return this.authService.validateBusiness(dto);
  }
  @Post('/refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }

}
