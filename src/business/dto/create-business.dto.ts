import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class CreateBusinessDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'ahlem@clothing.com',
    description: 'The email of the business',
  })
  business_email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    example: 'strongPassword123',
    description: 'The password of the business',
  })
  password: string;
}
