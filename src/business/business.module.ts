import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthBusiness } from './entities/auth-business.entity';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthBusiness]),
    forwardRef(() => AuthModule),
  ],
  controllers: [BusinessController],
  providers: [BusinessService],
  exports: [BusinessService, TypeOrmModule],
})
export class BusinessModule {}
