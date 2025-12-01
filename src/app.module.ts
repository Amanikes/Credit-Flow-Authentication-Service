import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import {redisStore } from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';


@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    CompanyModule,
    CacheModule.register({
      useFactory: async () => ({
        store : await redisStore({
          host: 'localhost',
          port: 6379,
        }),
        ttl: 5, // seconds
      })
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
