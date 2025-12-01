import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import {JwtModule, JwtSignOptions} from "@nestjs/jwt";
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [UserModule,
    JwtModule.register({
      global: true,
      secret: 'defaultSecretKey',
      signOptions: { expiresIn: '1h' } as JwtSignOptions,
    }),
    CacheModule.register({
      ttl: 0,
      isGlobal: true,
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
