import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BusinessModule } from 'src/business/business.module';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUser } from 'src/users/entities/auth-user.entity';
import { AuthBusiness } from 'src/business/entities/auth-business.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshToken } from 'src/tokens/entities/refresh-token.entity';

@Module({
  imports: [
    forwardRef(() => BusinessModule),
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([AuthUser, AuthBusiness, RefreshToken]),
   JwtModule.registerAsync({
     imports: [ConfigModule],
     inject: [ConfigService],
     useFactory: async (configService: ConfigService) => ({
       secret: configService.getOrThrow<string>('JWT_SECRET'),
       signOptions: {
         expiresIn: configService.get<string>('JWT_EXPIRES_IN') as any || '1h',
       },
     }),
   })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
