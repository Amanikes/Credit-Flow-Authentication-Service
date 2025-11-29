import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsString,
  MinLength,
  IsEnum,
  IsDateString,
  IsNotEmpty,
  Length,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Gender } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({ example: 'Abebe', minLength: 3 })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  first_name: string;

  @ApiProperty({ example: 'Kebede', minLength: 3 })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  father_name: string;

  @ApiProperty({ example: 'Tesfaye', minLength: 3 })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  grand_father_name: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '1234567890123456', minLength: 16 })
  @IsString()
  @Length(16, 16)
  fayda_id: string;

  @ApiProperty({ example: '+251912345678 or 0912345678', minLength: 10 })
  @IsString()
  @Length(10, 13)
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  terms_accepted: boolean;

  @ApiProperty({ example: 'male or female' })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: '1990-01-01' })
  @IsDateString()
  date_of_birth: string;

  
}
