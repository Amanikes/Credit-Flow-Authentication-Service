import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BusinessModule } from 'src/business/business.module';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUser } from 'src/users/entities/auth-user.entity';
import { AuthBusiness } from 'src/business/entities/auth-business.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => BusinessModule),
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([AuthUser, AuthBusiness]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn:'1h'},
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
